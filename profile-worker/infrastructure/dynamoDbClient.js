// const AWS = require("aws-sdk");

// require("dotenv").config();

// AWS.config.update({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_OURID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_OURKEY,
// });

// const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

// module.exports = dynamoDbClient;


const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_OURID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_OURKEY,
});

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDbClient;
