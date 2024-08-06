import ProfileRepository from "../../infrastructure/profileRepository";
import dynamoDbClient from "../../infrastructure/dynamoDbClient";
import PromptService from '../../services/promptService.js';
import OpenAIService from '../../infrastructure/openAIService.js';
import { config } from "../../config/config";

jest.mock("../../services/promptService");
jest.mock("../../infrastructure/openAIService");
jest.mock('../../config/config');
jest.mock('../../infrastructure/dynamoDbClient');


describe("ProfileRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProfiles", () => {
    it("should return profiles and lastEvaluatedKey when status is provided", async () => {
      const mockResult = {
        Items: [{ pk: "TEST_PK", sk: "TEST_PK#profile1", status: "draft" }],
        LastEvaluatedKey: { pk: "TEST_PK", sk: "TEST_PK#profile1" },
      };
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await ProfileRepository.getAllProfiles("draft", 10, null);

      expect(dynamoDbClient.query).toHaveBeenCalledWith({
        TableName: "test-table",
        IndexName: "status-stateModifiedAt-index",
        KeyConditionExpression: "#pk = :pkVal",
        ExpressionAttributeNames: {
          "#pk": "status",
        },
        ExpressionAttributeValues: {
          ":pkVal": "draft",
        },
        Limit: 10,
        ExclusiveStartKey: null,
        ScanIndexForward: false,
      });
      expect(result).toEqual({
        profiles: mockResult.Items,
        lastEvaluatedKey: mockResult.LastEvaluatedKey,
      });
    });

    it("should return profiles and lastEvaluatedKey when status is not provided", async () => {
      const mockResult = {
        Items: [{ pk: "TEST_PK", sk: "TEST_PK#profile1" }],
        LastEvaluatedKey: { pk: "TEST_PK", sk: "TEST_PK#profile1" },
      };
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await ProfileRepository.getAllProfiles("", 10, null);

      expect(dynamoDbClient.query).toHaveBeenCalledWith({
        TableName: "test-table",
        IndexName: "pk-stateModifiedAt-index",
        KeyConditionExpression: "#pk = :pkVal",
        ExpressionAttributeNames: {
          "#pk": "pk",
        },
        ExpressionAttributeValues: {
          ":pkVal": "TEST_PK",
        },
        Limit: 10,
        ExclusiveStartKey: null,
        ScanIndexForward: false,
      });
      expect(result).toEqual({
        profiles: mockResult.Items,
        lastEvaluatedKey: mockResult.LastEvaluatedKey,
      });
    });

    it("should handle empty result", async () => {
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [] }),
      });

      const result = await ProfileRepository.getAllProfiles("draft", 10, null);

      expect(result).toEqual({
        profiles: [],
        lastEvaluatedKey: null,
      });
    });

    it("should handle error", async () => {
      dynamoDbClient.query.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        ProfileRepository.getAllProfiles("draft", 10, null)
      ).rejects.toThrow("Error fetching profiles");
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully if it exists", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: {} }),
      });
      dynamoDbClient.delete.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await ProfileRepository.deleteProfile("test-slug");

      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: "TEST_PK",
          sk: "TEST_PK#test-slug",
        },
      });
      expect(dynamoDbClient.delete).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: "TEST_PK",
          sk: "TEST_PK#test-slug",
        },
      });
      expect(result).toBe(true);
    });

    it("should return false if profile does not exist", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await ProfileRepository.deleteProfile("non-existent-slug");

      expect(dynamoDbClient.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should handle error", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        ProfileRepository.deleteProfile("error-slug")
      ).rejects.toThrow("DynamoDB error");
    });
  });

  describe("getProfile", () => {
    it("should return profile if it exists", async () => {
      const mockProfile = { pk: "TEST_PK", sk: "TEST_PK#test-slug", firstName: "John" };
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockProfile }),
      });

      const result = await ProfileRepository.getProfile("test-slug");

      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: "TEST_PK",
          sk: "TEST_PK#test-slug",
        },
      });
      expect(result).toEqual(mockProfile);
    });

    it("should return null if profile does not exist", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await ProfileRepository.getProfile("non-existent-slug");

      expect(result).toBe(null);
    });

    it("should handle error", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        ProfileRepository.getProfile("error-slug")
      ).rejects.toThrow("Failed to get data from DynamoDB.");
    });
  });

  describe("checkProfileExists", () => {
    it("should return true if profile exists", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: {} }),
      });

      const result = await ProfileRepository.checkProfileExists("existing-slug");

      expect(dynamoDbClient.get).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: "TEST_PK",
          sk: "TEST_PK#existing-slug",
        },
      });
      expect(result).toBe(true);
    });

    it("should return false if profile does not exist", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await ProfileRepository.checkProfileExists("non-existing-slug");

      expect(result).toBe(false);
    });

    it("should handle error", async () => {
      dynamoDbClient.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      const result = await ProfileRepository.checkProfileExists("error-slug");

      expect(result).toBe(false);
    });
  });

  describe("createProfile", () => {
    it("should create profile successfully", async () => {
      dynamoDbClient.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const profile = {
        pk: "TEST_PK",
        sk: "TEST_PK#new-profile",
        firstName: "John",
        lastName: "Doe",
      };

      await expect(
        ProfileRepository.createProfile(profile)
      ).resolves.not.toThrow();

      expect(dynamoDbClient.put).toHaveBeenCalledWith({
        TableName: "test-table",
        Item: profile,
      });
    });

    it("should handle error", async () => {
      dynamoDbClient.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      const profile = {
        pk: "TEST_PK",
        sk: "TEST_PK#error-profile",
        firstName: "John",
        lastName: "Doe",
      };

      await expect(ProfileRepository.createProfile(profile)).rejects.toThrow(
        "Failed to store data in DynamoDB."
      );
    });
  });

  describe('devCrew-regenerateAndUpdateProfile', () => {
    const slug = 'test-slug';
    const property = 'test.property.path';
    const data = { some: 'data' };
    const profile = { slug: slug };
    const summaryValue = 'generated summary';
    const responsibilitiesValue = { responsibilitiesAndAccomplishments: 'generated responsibilities' };
    const skillsValue = { technicalSkills: 'generated skills' };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if profile is not found', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(null);

      await expect(ProfileRepository.regenerateAndUpdateProfile(slug, 'profileSummary', property, data)).rejects.toThrow('Profile not found');
    });

    it('should regenerate and update profile summary', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(profile);
      PromptService.profileSummaryPrompt.mockResolvedValue('profile-summary-prompt');
      OpenAIService.generate.mockResolvedValue(summaryValue);
      jest.spyOn(ProfileRepository, 'updateProfileData').mockResolvedValue({ success: true });

      const result = await ProfileRepository.regenerateAndUpdateProfile(slug, 'profileSummary', property, data);

      expect(PromptService.profileSummaryPrompt).toHaveBeenCalledWith(data);
      expect(OpenAIService.generate).toHaveBeenCalledWith('profile-summary-prompt');
      expect(ProfileRepository.updateProfileData).toHaveBeenCalledWith(slug, property, summaryValue);
      expect(result).toEqual({ success: true });
    });

    it('should regenerate and update experience summary', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(profile);
      PromptService.experienceSummaryPrompt.mockResolvedValue('experience-summary-prompt');
      OpenAIService.generate.mockResolvedValue(summaryValue);
      jest.spyOn(ProfileRepository, 'updateProfileData').mockResolvedValue({ success: true });

      const result = await ProfileRepository.regenerateAndUpdateProfile(slug, 'experienceSummary', property, data);

      expect(PromptService.experienceSummaryPrompt).toHaveBeenCalledWith(data);
      expect(OpenAIService.generate).toHaveBeenCalledWith('experience-summary-prompt');
      expect(ProfileRepository.updateProfileData).toHaveBeenCalledWith(slug, property, summaryValue);
      expect(result).toEqual({ success: true });
    });

    it('should regenerate and update experience responsibilities', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(profile);
      PromptService.experienceresponsibilitiesPrompt.mockResolvedValue('experience-responsibilities-prompt');
      OpenAIService.generate.mockResolvedValue(JSON.stringify(responsibilitiesValue));
      jest.spyOn(ProfileRepository, 'updateProfileData').mockResolvedValue({ success: true });

      const result = await ProfileRepository.regenerateAndUpdateProfile(slug, 'experienceResponsibilities', property, data);

      expect(PromptService.experienceresponsibilitiesPrompt).toHaveBeenCalledWith(data);
      expect(OpenAIService.generate).toHaveBeenCalledWith('experience-responsibilities-prompt');
      expect(ProfileRepository.updateProfileData).toHaveBeenCalledWith(slug, property, responsibilitiesValue.responsibilitiesAndAccomplishments);
      expect(result).toEqual({ success: true });
    });

    it('should regenerate and update technical skills', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(profile);
      PromptService.candidateTechnicalSkillsPrompt.mockResolvedValue('technical-skills-prompt');
      OpenAIService.generate.mockResolvedValue(JSON.stringify(skillsValue));
      jest.spyOn(ProfileRepository, 'updateProfileData').mockResolvedValue({ success: true });

      const result = await ProfileRepository.regenerateAndUpdateProfile(slug, 'technicalSkills', property, data);

      expect(PromptService.candidateTechnicalSkillsPrompt).toHaveBeenCalledWith(data);
      expect(OpenAIService.generate).toHaveBeenCalledWith('technical-skills-prompt');
      expect(ProfileRepository.updateProfileData).toHaveBeenCalledWith(slug, property, skillsValue.technicalSkills);
      expect(result).toEqual({ success: true });
    });

    it('should regenerate and update project summary', async () => {
      jest.spyOn(ProfileRepository, 'getProfileBySlug').mockResolvedValue(profile);
      PromptService.projectSummaryPrompt.mockResolvedValue('project-summary-prompt');
      OpenAIService.generate.mockResolvedValue(summaryValue);
      jest.spyOn(ProfileRepository, 'updateProfileData').mockResolvedValue({ success: true });

      const result = await ProfileRepository.regenerateAndUpdateProfile(slug, 'projectSummary', property, data);

      expect(PromptService.projectSummaryPrompt).toHaveBeenCalledWith(data);
      expect(OpenAIService.generate).toHaveBeenCalledWith('project-summary-prompt');
      expect(ProfileRepository.updateProfileData).toHaveBeenCalledWith(slug, property, summaryValue);
      expect(result).toEqual({ success: true });
    });
  });
  describe("updateProfileAttribute", () => {
    it("should update profile attribute successfully", async () => {
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Attributes: { firstName: "UpdatedName" } }),
      });

      const result = await ProfileRepository.updateProfileAttribute("test-slug", "firstName", "UpdatedName");

      expect(dynamoDbClient.update).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: "TEST_PK",
          sk: "TEST_PK#test-slug",
        },
        UpdateExpression: "set firstName = :newValue",
        ExpressionAttributeValues: {
          ":newValue": "UpdatedName",
        },
        ReturnValues: "UPDATED_NEW",
      });
      expect(result).toEqual({ firstName: "UpdatedName" });
    });

    it("should handle error", async () => {
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        ProfileRepository.updateProfileAttribute("test-slug", "firstName", "UpdatedName")
      ).rejects.toThrow("Failed to update data in DynamoDB.");
    });
  });

  describe("updatedProfile", () => {
    it("should update profile successfully", async () => {
      const mockAttributes = { firstName: "UpdatedName" };
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Attributes: mockAttributes }),
      });

      const result = await ProfileRepository.updatedProfile(
        "test-slug",
        "set firstName = :firstName",
        { "#firstName": "firstName" },
        { ":firstName": "UpdatedName" }
      );

      expect(dynamoDbClient.update).toHaveBeenCalledWith({
        TableName: "test-table",
        Key: {
          pk: config.primaryKey,
          sk: `${config.primaryKey}#test-slug`,
        },
        UpdateExpression: "set firstName = :firstName",
        ExpressionAttributeNames: { "#firstName": "firstName" },
        ExpressionAttributeValues: { ":firstName": "UpdatedName" },
        ReturnValues: "ALL_NEW",
      });
      expect(result).toEqual(mockAttributes);
    });

    it("should handle error", async () => {
      dynamoDbClient.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        ProfileRepository.updatedProfile(
          "test-slug",
          "set firstName = :firstName",
          { "#firstName": "firstName" },
          { ":firstName": "UpdatedName" }
        )
      ).rejects.toThrow("Failed to update data in DynamoDB.");
    });
  });
});
