const userManagementRepo = require('../../infrastructure/userManagmentRepo'); // Adjust the path accordingly
const dynamoDbClient = require('../../infrastructure/dynamoDbClient'); // Adjust the path accordingly
const config = require('../../config/config'); // Adjust the path accordingly

jest.mock('../../infrastructure/dynamoDbClient');

describe('userManagementRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockResult = {
        Items: [
          { firstName: 'John', lastName: 'Doe', email: 'john@example.com', acl: { roles: ['admin'] }, createdAt: '2023-01-01' },
          // Add more mock users if needed
        ],
      };
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await userManagementRepo.getAllUsers();

      expect(result).toEqual([
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', roles: ['admin'], createdAt: '2023-01-01' },
        // Add more expected users if needed
      ]);
    });

    it('should return null if no users are found', async () => {
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: null }),
      });

      const result = await userManagementRepo.getAllUsers();

      expect(result).toBeNull();
    });

    it('should throw an error if query fails', async () => {
      const error = new Error('Query error');
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      await expect(userManagementRepo.getAllUsers()).rejects.toThrow(error);
    });
  });

  describe('getUserByEmail', () => {
    it('should return the user if found', async () => {
      const mockResult = { Items: [{ email: 'john@example.com' }] };
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await userManagementRepo.getUserByEmail('john@example.com');

      expect(result).toEqual({ email: 'john@example.com' });
    });

    it('should return null if no user is found', async () => {
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [] }),
      });

      const result = await userManagementRepo.getUserByEmail('john@example.com');

      expect(result).toBeNull();
    });

    it('should throw an error if query fails', async () => {
      const error = new Error('Query error');
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      await expect(userManagementRepo.getUserByEmail('john@example.com')).rejects.toThrow(error);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      dynamoDbClient.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await userManagementRepo.createUser('john@example.com', 'password123', 'John', 'Doe', ['admin'], '2023-01-01');

      expect(result).toEqual({ success: true, message: 'User created successfully' });
    });

    it('should return an error if creation fails', async () => {
      const error = new Error('Put error');
      dynamoDbClient.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await userManagementRepo.createUser('john@example.com', 'password123', 'John', 'Doe', ['admin'], '2023-01-01');

      expect(result).toEqual({ success: false, message: 'Error creating user', error });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      dynamoDbClient.delete.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await userManagementRepo.deleteUser('john@example.com');

      expect(result).toBe(true);
    });

    it('should return false if no item was found to delete', async () => {
      dynamoDbClient.delete.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Attributes: {} }),
      });

      const result = await userManagementRepo.deleteUser('john@example.com');

      expect(result).toBe(false);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Delete error');
      dynamoDbClient.delete.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      await expect(userManagementRepo.deleteUser('john@example.com')).rejects.toThrow(error);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const mockResult = { Attributes: { firstName: 'John', lastName: 'Doe', acl: { roles: ['admin'] } } };
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await userManagementRepo.updateUser('john@example.com', 'John', 'Doe', ['admin']);

      expect(result).toEqual({ success: true, message: 'User updated successfully', data: mockResult.Attributes });
    });

    it('should return an error if update fails', async () => {
      const error = new Error('Update error');
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await userManagementRepo.updateUser('john@example.com', 'John', 'Doe', ['admin']);

      expect(result).toEqual({ success: false, message: 'Error updating user', error });
    });
  });

  describe('updatePassword', () => {
    it('should update the password successfully', async () => {
      const mockResult = { Attributes: { password: 'newPassword123' } };
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await userManagementRepo.updatePassword('john@example.com', 'newPassword123');

      expect(result).toEqual({ success: true, updatedUser: mockResult.Attributes });
    });

    it('should return an error if update fails', async () => {
      const error = new Error('Update error');
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await userManagementRepo.updatePassword('john@example.com', 'newPassword123');

      expect(result).toEqual({ success: false, error });
    });
  });
});
