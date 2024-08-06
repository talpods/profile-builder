const userRepository = require('../infrastructure/userRepository');
const dynamoDbClient = require('../infrastructure/dynamoDbClient');
const config = require('../config/config');


// Mocking DynamoDB client methods
jest.mock('../infrastructure/dynamoDbClient');

describe('userRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should fetch user from DynamoDB', async () => {
        const mockUser = {
            PK: "users",
            SK: "users#iqra@gmail.com",
            email: "iqra@gmail.com",
            firstName: "Iqra",
            lastName: "Baig",
            password: "12345",
            role: [
             "recruiter",
             "admin"
            ],
            username:"iqrabaig123"
           };

      // Mock DynamoDB client response
      dynamoDbClient.get.mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue({ Item: mockUser })
      }));

      const email = 'test@example.com';
      const user = await userRepository.getUserByEmail(email);

      expect(user).toEqual(mockUser);

      // Verify DynamoDB client method was called with correct parameters
      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable, // Replace with your actual table name
        Key: {
          PK: 'users',
          SK: `users#${email}`
        }
      });
    });

    it('should handle errors from DynamoDB client', async () => {
      const mockError = new Error('DynamoDB error');

      // Mock DynamoDB client response with error
      dynamoDbClient.get.mockImplementation(() => ({
        promise: jest.fn().mockRejectedValue(mockError)
      }));

      const email = 'test@example.com';

      await expect(userRepository.getUserByEmail(email)).rejects.toThrow('Error fetching user');

      // Verify DynamoDB client method was called with correct parameters
      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable, // Replace with your actual table name
        Key: {
          PK: 'users',
          SK: `users#${email}`
        }
      });
    });
  });
});
