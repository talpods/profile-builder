import profileNbRepository from '../../infrastructure/profileNbRepository.js'; 
import dynamoDbClient from '../../infrastructure/dynamoDbClient.js';
import {config} from '../../config/config.js';

jest.mock('../../infrastructure/dynamoDbClient.js');
jest.mock('../../config/config.js');

describe('profileNbRepository', () => {
  describe('getProfileNumber', () => {
    it('should return profile numbers on success', async () => {
      // Mock the scan method
      dynamoDbClient.scan.mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Items: [{ profileNumber: '123' }, { profileNumber: '456' }],
        }),
      });

      const result = await profileNbRepository.getProfileNumber();

      expect(result).toEqual([{ profileNumber: '123' }, { profileNumber: '456' }]);
      expect(dynamoDbClient.scan).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable,
        FilterExpression: "#pk = :pkVal",
        ExpressionAttributeNames: { "#pk": "pk" },
        ExpressionAttributeValues: { ":pkVal": "talentProfile" },
        ProjectionExpression: "profileNumber",
      });
    });

    it('should throw an error on failure', async () => {
      // Mock the scan method to throw an error
      dynamoDbClient.scan.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      });

      const originalConsoleError = console.error;
      console.error = jest.fn();

      await expect(profileNbRepository.getProfileNumber()).rejects.toThrow('DynamoDB error');
      expect(dynamoDbClient.scan).toHaveBeenCalledWith({
        TableName: config.dynamoDbTable, 
        FilterExpression: "#pk = :pkVal",
        ExpressionAttributeNames: { "#pk": "pk" },
        ExpressionAttributeValues: { ":pkVal": "talentProfile" },
        ProjectionExpression: "profileNumber",
      });
      console.error = originalConsoleError;
    });
  });
});
