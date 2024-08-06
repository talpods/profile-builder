const dynamoDbClient = require('../../infrastructure/dynamoDbClient');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const AWSMock = {
        config: {
            update: jest.fn(),
        },
        DynamoDB: {
            DocumentClient: jest.fn(),
        },
    };

    return AWSMock;
});

describe('DynamoDB Client Configuration', () => {
    it('should configure AWS SDK with environment variables', () => {
        expect(AWS.config.update).toHaveBeenCalledWith({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_OURID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_OURKEY,
        });
    });

    it('should create a DocumentClient instance', () => {
        expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalled();
        expect(dynamoDbClient).toBeInstanceOf(AWS.DynamoDB.DocumentClient);
    });

    it('should export the initialized DynamoDB DocumentClient', () => {
        expect(dynamoDbClient).toBeDefined();
    });
});
