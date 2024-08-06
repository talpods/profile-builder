import slugRepository from '../../infrastructure/slugRepository.js';
import dynamoDbClient from '../../infrastructure/dynamoDbClient.js'; // Assuming this is correctly mocked or imported
import createSlug from '../../helpers/createSlug.js';
import { config } from '../../config/config.js';

// Mock DynamoDB client
jest.mock('../../infrastructure/dynamoDbClient.js', () => ({
  scan: jest.fn().mockReturnThis(), // Mock the scan function to return this (the mock itself)
  promise: jest.fn(), // Mock the promise function separately
}));

// Mock createSlug function
jest.mock('../../helpers/createSlug.js', () => jest.fn().mockImplementation((firstName, lastName) => `${firstName.toLowerCase()}-${lastName.toLowerCase()}`));

// Mock config
jest.mock('../../config/config.js');

describe('slugRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve profiles by slug successfully', async () => {
    // Mock data and expected parameters
    const firstName = 'John';
    const lastName = 'Doe';
    const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const mockData = {
      Items: [
        { slug: 'talentProfile#john-doe-1' },
        { slug: 'talentProfile#john-doe-2' },
      ],
    };
    const expectedParams = {
      TableName: config.dynamoDbTable,
      FilterExpression: '#pk = :pkVal AND begins_with(#sk, :skPrefix)',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pkVal': 'talentProfile', ':skPrefix': `talentProfile#${slug}` },
      ProjectionExpression: 'slug',
    };

    // Mock DynamoDBClient.scan to resolve with mockData
    dynamoDbClient.promise.mockResolvedValue({ Items: mockData });

    // Call the method under test
    const result = await slugRepository.getProfilesBySlug(firstName, lastName);

    // Verify DynamoDBClient.scan was called with the correct parameters
    expect(dynamoDbClient.scan).toHaveBeenCalledWith(expectedParams);

    // Verify the result matches mockData.Items
    expect(result).toEqual(mockData);
  });

  it('should throw an error when DynamoDB scan fails', async () => {
    // Mock parameters
    const firstName = 'John';
    const lastName = 'Doe';
    const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const expectedError = new Error('DynamoDB error');

    // Mock DynamoDBClient.scan to reject with an error
    dynamoDbClient.promise.mockRejectedValue(expectedError);

    // Call the method under test and expect it to throw an error
    await expect(slugRepository.getProfilesBySlug(firstName, lastName)).rejects.toThrow(expectedError);

    // Verify DynamoDBClient.scan was called with the correct parameters
    const expectedParams = {
      TableName: config.dynamoDbTable,
      FilterExpression: '#pk = :pkVal AND begins_with(#sk, :skPrefix)',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pkVal': 'talentProfile', ':skPrefix': `talentProfile#${slug}` },
      ProjectionExpression: 'slug',
    };
    expect(dynamoDbClient.scan).toHaveBeenCalledWith(expectedParams);
  });
});
