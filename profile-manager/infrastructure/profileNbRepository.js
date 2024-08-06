import dynamoDbClient from './dynamoDbClient.js';
import { config } from "../config/config.js";

class profileNbRepository {
        
     async getProfileNumber() { 
         const params = {
             TableName: config.dynamoDbTable,
              FilterExpression: "#pk = :pkVal",
               ExpressionAttributeNames: { "#pk": "pk", },
                ExpressionAttributeValues: { ":pkVal": "talentProfile", },
                 ProjectionExpression: "profileNumber", 
                 
                  };
                  try { 
                    const data = await dynamoDbClient.scan(params).promise();
                     return data.Items; 
                    } catch (error) {
                         console.error("Error scanning DynamoDB:", error);
                          throw error; 
                        } 
                    }

}

export default new profileNbRepository();