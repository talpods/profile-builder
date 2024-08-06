import dynamoDbClient from "./dynamoDbClient.js";
import { config } from "../config/config.js";
import PromptService from "../services/promptService.js";
import OpenAIService from "./openAIService.js";

class ProfileRepository {
  static async getAllProfiles(status, limit, lastEvaluatedKey) {
    let params;
    if (status !== "") {
      params = {
        TableName: config.dynamoDbTable,
        IndexName: "status-stateModifiedAt-index",
        KeyConditionExpression: "#pk = :pkVal",
        ExpressionAttributeNames: {
          "#pk": "status",
        },
        ExpressionAttributeValues: {
          ":pkVal": status,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      };
    } else {
      params = {
        TableName: config.dynamoDbTable,
        IndexName: "pk-stateModifiedAt-index",
        KeyConditionExpression: "#pk = :pkVal",
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pkVal": config.primaryKey,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false,
      };
    }

    try {
      const result = await dynamoDbClient.query(params).promise();
      return {
        profiles: result.Items || [],
        lastEvaluatedKey: result.LastEvaluatedKey || null,
      };
    } catch (error) {
      console.error(`Error fetching profiles: ${error}`);
      throw new Error("Error fetching profiles");
    }
  }

  static async deleteProfile(slug) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
    };

    let profileExists = await this.checkProfileExists(slug);

    if (profileExists) {
      const result = await dynamoDbClient.delete(params).promise();
      return true;
    } else {
      return false;
    }
  }

  static async getProfile(slug) {
    try {
      const params = {
        TableName: config.dynamoDbTable,
        Key: {
          pk: config.primaryKey,
          sk: `${config.primaryKey}#${slug}`,
        },
      };
      const profile = await dynamoDbClient.get(params).promise();
      if (profile) {
        return profile.Item;
      } else {
        return null;
      }
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Failed to get data from DynamoDB.",
        details: error.message,
      };
    }
  }

  static async checkProfileExists(slug) {
    try {
      const params = {
        TableName: config.dynamoDbTable,
        Key: {
          pk: config.primaryKey,
          sk: `${config.primaryKey}#${slug}`,
        },
      };
      const profile = await dynamoDbClient.get(params).promise();
      return !!profile.Item; // Use !! to convert to boolean
    } catch (error) {
      console.error(`Error checking profile existence: ${error}`);
      return false; // Or throw the error if you want to propagate it
    }
  }

  static async createProfile(profile) {
    const params = {
      TableName: config.dynamoDbTable,
      Item: profile,
    };

    try {
      await dynamoDbClient.put(params).promise();
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Failed to store data in DynamoDB.",
        details: error.message,
      };
    }
  }
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

  static async updateProfileAttribute(slug, attributeName, newValue) {
    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
      UpdateExpression: `set ${attributeName} = :newValue`,
      ExpressionAttributeValues: {
        ":newValue": newValue,
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const result = await dynamoDbClient.update(params).promise();
    } catch {
      throw {
        statusCode: 500,
        message: "Failed to update data in DynamoDB.",
        details: error.message,
      };
    }
  }

  static async updatedProfile(
    oldSlug,
    updateExpression,
    expressionAttributeNames,
    expressionAttributeValues
  ) {
    try {
      let expression = updateExpression;
      if (expression.endsWith(",")) {
        expression = expression.slice(0, -1);
      }
      const params = {
        TableName: config.dynamoDbTable,
        Key: {
          pk: config.primaryKey,
          sk: `${config.primaryKey}#${oldSlug}`,
        },
        UpdateExpression: expression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      };
      const result = await dynamoDbClient.update(params).promise();
      return result.Attributes;
    } catch {
      throw {
        statusCode: 500,
        message: "Failed to update data in DynamoDB.",
        details: error.message,
      };
    }
  }

  static async regenerateAndUpdateProfile(slug, generateType, property, data) {
    const profile = await ProfileRepository.getProfileBySlug(slug);
    let prompt;
    if (!profile) {
      throw new Error("Profile not found");
    }

    if (generateType === "profileSummary") {
      if (
        data.level == "Software engineer entry level" ||
        data.level == "Software engineer level 1"
      ) {
        prompt = await PromptService.profileSummaryPromptForJunior(data);
      } else {
        prompt = await PromptService.profileSummaryPrompt(data);
      }

      const summary = await OpenAIService.generate(prompt);
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        summary
      );

      return result;
    }
    if (generateType === "experienceSummary") {
      const prompt = await PromptService.experienceSummaryPrompt(data);
      const summary = await OpenAIService.generate(prompt);
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        summary
      );

      return result;
    }
    if (generateType === "experienceResponsibilities") {
      const prompt = await PromptService.experienceresponsibilitiesPrompt(data);
      const responsibilities = await OpenAIService.generate(prompt);
      const dataToUpdate = JSON.parse(cleanJsonString(responsibilities));
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        dataToUpdate.responsibilitiesAndAccomplishments
      );

      return result;
    }
    if (generateType === "technicalSkills") {
      const prompt = await PromptService.candidateTechnicalSkillsPrompt(data);
      const skills = await OpenAIService.generate(prompt);
      const dataToUpdate = JSON.parse(cleanJsonString(skills));
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        dataToUpdate.technicalSkills
      );

      return result;
    }
    if (generateType === "projectSummary") {
      const prompt = await PromptService.projectSummaryPrompt(data);
      const summary = await OpenAIService.generate(prompt);
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        summary
      );

      return result;
    }
    if (generateType === "recommendationRefinement") {
      const prompt = await PromptService.recommendationPrompt(data);
      const recommendation = await OpenAIService.generate(prompt);
      const result = await ProfileRepository.updateProfileData(
        slug,
        property,
        recommendation
      );

      return result;
    } else {
      throw new Error("Invalid generateType");
    }
  }
  static async updateProfileData(slug, path, newValue) {
    const pathParts = path.split(".");
    let updateExpression = "SET ";

    let expressionAttributeNames = {};
    let expressionAttributeValues = {
      ":newValue": newValue,
    };

    // Build the property path dynamically
    let propertyPath = "";
    pathParts.forEach((part, index) => {
      if (isNaN(part)) {
        // If the part is not a number, add it as a property
        const attributeName = `#${part}`;
        propertyPath += (index === 0 ? "" : ".") + attributeName;
        expressionAttributeNames[attributeName] = part;
      } else {
        // If the part is a number, add it as an array index
        propertyPath += `[${part}]`;
      }
    });

    updateExpression += `${propertyPath} = :newValue`;

    const params = {
      TableName: config.dynamoDbTable,
      Key: {
        pk: config.primaryKey,
        sk: `${config.primaryKey}#${slug}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const result = await dynamoDbClient.update(params).promise();
      return {
        success: true,
        message: `Profile property ${path} updated successfully`,
        data: result.Attributes,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error updating profile property ${path}`,
        error: error,
      };
    }
  }
}
function cleanJsonString(jsonString) {
  let cleaned = jsonString.replace(/^\s*```json\s*/, "");
  cleaned = cleaned.replace(/\s*```\s*$/, "");
  return cleaned.trim();
}
export default ProfileRepository;
