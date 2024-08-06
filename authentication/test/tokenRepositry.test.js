const tokenManager = require('../infrastructure/tokenManager');
const dynamoDbClient = require('../infrastructure/dynamoDbClient');
const config = require('../config/config');
jest.mock('../infrastructure/dynamoDbClient');

describe('tokenManager', () => {
  const mockPut = jest.fn();
  const mockUpdate = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    dynamoDbClient.put.mockImplementation(() => ({
      promise: mockPut,
    }));
    dynamoDbClient.update.mockImplementation(() => ({
      promise: mockUpdate,
    }));
    dynamoDbClient.get.mockImplementation(() => ({
      promise: mockGet,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storeToken', () => {
    it('should store the token in DynamoDB', async () => {
      const accessToken = 'testToken';
      const refreshToken = 'testToken';
      const accessTokenExpiration = '1541684';
      const refreshTokenExpiration = '5494644';
      const refreshTokenInvalidated = false;
      mockPut.mockResolvedValueOnce({});
      
      await tokenManager.storeTokens(accessToken, refreshToken, accessTokenExpiration, refreshTokenExpiration,refreshTokenInvalidated);

      expect(dynamoDbClient.put).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable,
        Item: {
          PK: 'tokens',
          SK: `tokens#${refreshToken}`,
          accessToken,
          accessTokenExpiration,
          invalidated: false,
          refreshToken,
          refreshTokenExpiration,
          refreshTokenInvalidated
        },
      });
    });
  });

  describe('invalidateToken', () => {
    it('should invalidate the token in DynamoDB', async () => {
      const refreshToken = 'testToken';
      mockUpdate.mockResolvedValueOnce({});
      
      await tokenManager.invalidateToken(refreshToken);

      expect(dynamoDbClient.update).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable,
        Key: {
          PK: 'tokens',
          SK: `tokens#${refreshToken}`,
        },
        UpdateExpression: 'set invalidated = :invalidated',
        ExpressionAttributeValues: {
          ':invalidated': true,
        },
      });
    });
  });

  describe('isTokenInvalidated', () => {
    it('should return true if the token is invalidated', async () => {
      const refreshToken = 'testToken';
      mockGet.mockResolvedValueOnce({
        Item: {
          invalidated: true,
        },
      });
      
      const result = await tokenManager.isTokenInvalidated(refreshToken);

      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable,
        Key: {
          PK: 'tokens',
          SK: `tokens#${refreshToken}`,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if the token is not invalidated', async () => {
      const refreshToken = 'testToken';
      mockGet.mockResolvedValueOnce({
        Item: {
          invalidated: false,
        },
      });
      
      const result = await tokenManager.isTokenInvalidated(refreshToken);

      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable,
        Key: {
          PK: 'tokens',
          SK: `tokens#${refreshToken}`,
        },
      });
      expect(result).toBe(false);
    });

  });
});
