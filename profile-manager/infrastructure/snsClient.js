import AWS from "aws-sdk";
import { config } from "../config/config.js";

AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const snsClient = new AWS.SNS();

export default snsClient;
