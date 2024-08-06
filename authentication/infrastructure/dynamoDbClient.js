const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1
});

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();


module.exports = dynamoDbClient;
