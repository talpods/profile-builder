import AWS from "aws-sdk";
import { config } from "../config/config.js";

AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const s3 = new AWS.S3();

export default s3;
