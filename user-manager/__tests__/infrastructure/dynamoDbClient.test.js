const AWS = require('aws-sdk');
require('dotenv').config();
const dynamoDbClient = require('../../infrastructure/dynamoDbClient'); // Adjust the path as necessary

describe('DynamoDB Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...originalEnv }; // Restores the original environment variables
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original env after each test
  });

  it('should configure AWS SDK with environment variables', () => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID1 = 'fakeAccessKeyId';
    process.env.AWS_SECRET_ACCESS_KEY1 = 'fakeSecretAccessKey';

    jest.mock('aws-sdk', () => {
      const mockConfig = {
        update: jest.fn()
      };
      const mockDocumentClient = jest.fn();
      return {
        config: mockConfig,
        DynamoDB: {
          DocumentClient: mockDocumentClient
        }
      };
    });

    // Require the module again to use the mocked AWS SDK
    const mockedAWS = require('aws-sdk');
    const dynamoDbClient = require('../../infrastructure/dynamoDbClient'); // Adjust the path as necessary

    expect(mockedAWS.config.update).toHaveBeenCalledWith({
      region: 'us-east-1',
      accessKeyId: 'fakeAccessKeyId',
      secretAccessKey: 'fakeSecretAccessKey'
    });

    expect(mockedAWS.DynamoDB.DocumentClient).toHaveBeenCalled();
  });
});
