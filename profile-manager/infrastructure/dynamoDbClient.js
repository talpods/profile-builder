import { config } from "../config/config.js";
import AWS from "aws-sdk";

AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

export default dynamoDbClient;
