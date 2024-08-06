const dynamoDbClient = require("./dynamoDbClient.js");
const { config } = require("../config/config.js");
const { downloadAndParseDocument } = require("../helpers/fileToText.js");
const s3 = require("../infrastructure/s3Client.js");
class ProfileRepository {
  static async getProfileBySlug(slug) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
    };
    try {
      const result = await dynamoDbClient.get(params).promise();
      return result.Item || null;
    } catch (error) {
      console.error(`Error retrieving profile: ${error}`);
      throw error;
    }
  }

  static async updateProfile(slug, updateData) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
      UpdateExpression: "SET",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: "UPDATED_NEW",
    };

    Object.keys(updateData).forEach((key, index) => {
      const attributeName = `#attr${index}`;
      const attributeValue = `:val${index}`;

      params.UpdateExpression += `${
        index === 0 ? "" : ","
      } ${attributeName} = ${attributeValue}`;
      params.ExpressionAttributeNames[attributeName] = key;
      params.ExpressionAttributeValues[attributeValue] = updateData[key];
    });

    try {
      const result = await dynamoDbClient.update(params).promise();
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.Attributes,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: "Error updating profile",
        error: error,
      };
    }
  }

  static async updateProfileProperty(slug, propertyName, propertyValue) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
      UpdateExpression: `SET #attr = :val`,
      ExpressionAttributeNames: {
        "#attr": propertyName,
      },
      ExpressionAttributeValues: {
        ":val": propertyValue,
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const result = await dynamoDbClient.update(params).promise();
      return {
        success: true,
        message: "Profile property updated successfully",
        data: result.Attributes,
      };
    } catch (error) {
      console.error("Error updating profile property:", error);
      return {
        success: false,
        message: "Error updating profile property",
        error: error,
      };
    }
  }

  static async fetchAndParseFileFromS3(fileName) {
    // Extract bucket name and key from the file URL

    const bucketName = config.awsS3Bucket;
    const key = fileName;
    // Fetch file from S3
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const data = await s3.getObject(params).promise();
      const buffer = data.Body;

      // Use helper to parse the document
      const parsedText = await downloadAndParseDocument(buffer, key);
      if (parsedText == null) {
        throw new Error(`${fileName} was not parsed correctly`);
      }
      return parsedText;
    } catch (error) {
      console.error(`Error fetching or parsing file from S3: ${error}`);
      throw error;
    }
  }
}

module.exports = ProfileRepository;
