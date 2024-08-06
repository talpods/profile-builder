import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  awsRegion: process.env.AWS_REGION,
  dynamoDbTable: process.env.DYNAMODB_TABLE,
  primaryKey: process.env.PRIMARY_KEY,
  version: process.env.VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
  snsTopicArn: process.env.SNS_TOPIC_ARN,
  region: process.env.AWS_REGION1,
  publicBucket: process.env.AWS_PUBLIC_BUCKET,
  privateBucket: process.env.AWS_PRIVATE_BUCKET,
  publicBucketLink: process.env.AWS_PUBLIC_BUCKET_LINK,
  validateLink: process.env.VALIDATE_LINK,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedImageFormats: ["image/jpeg", "image/png"],
  allowedDocFormats: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
    "text/plain",
  ],
};
