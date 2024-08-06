const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const tokenService = require('../services/tokenService');
const authenticateUser = require('../usecases/authenticateUser');
const User = require('../entities/user');

jest.mock('../services/userService');
jest.mock('../services/tokenService');
jest.mock('jsonwebtoken');

describe('authenticateUser', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockUser = {
    email: mockEmail,
    password: mockPassword,
    firstName: 'John',
    lastName: 'Doe',
    acl: {
    roles: ['user'],
    resources: ['read']}
  };
  
  beforeEach(() => {
    userService.getUserByEmail.mockReset();
    tokenService.storeTokens.mockReset();
    jwt.sign.mockReset();
  });

  it('should throw an error if user does not exist', async () => {
    userService.getUserByEmail.mockResolvedValue(null);

    await expect(authenticateUser(mockEmail, mockPassword))
      .rejects
      .toThrow('Invalid email or password');
  });

  it('should throw an error if password does not match', async () => {
    userService.getUserByEmail.mockResolvedValue(mockUser);
    
    await expect(authenticateUser(mockEmail, 'wrongPassword'))
      .rejects
      .toThrow('Invalid email or password');
  });

  it('should return access and refresh tokens for valid credentials', async () => {
    userService.getUserByEmail.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

    const result = await authenticateUser(mockEmail, mockPassword);

    expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: mockUser.email, firstName: mockUser.firstName, lastName: mockUser.lastName, roles: mockUser.acl.roles, permissions: mockUser.acl.resources },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: mockUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    expect(tokenService.storeTokens).toHaveBeenCalledWith('accessToken', 'refreshToken');
    expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
  });
});
