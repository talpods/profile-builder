import dynamoDbClient from './dynamoDbClient.js';
import { config } from "../config/config.js";
import createSlug from "../helpers/createSlug.js";


class slugRepository {
        
     async getProfilesBySlug(firstName, lastName) { 
        const slug = createSlug(firstName, lastName);
         const params = {
             TableName: config.dynamoDbTable,
              FilterExpression: "#pk = :pkVal AND begins_with(#sk, :skPrefix)",
               ExpressionAttributeNames: { "#pk": "pk", "#sk": "sk", },
                ExpressionAttributeValues: { ":pkVal": "talentProfile", ":skPrefix": `talentProfile#${slug}`, },
                 ProjectionExpression: "slug",
                 
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

export default new slugRepository();