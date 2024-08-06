const { config } = require("../config/config.js");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
});

module.exports = s3;
