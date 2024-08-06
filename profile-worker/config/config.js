require("dotenv").config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  awsRegion: process.env.AWS_REGION,
  dynamoDbTable: process.env.DYNAMODB_TABLE,
  openAiKey: process.env.OPENAI_API_KEY,
  primaryKey: process.env.PRIMARY_KEY, // Make sure this is defined in your .env file
  awsS3Bucket: process.env.S3_BUCKET,
};

module.exports = { config };
