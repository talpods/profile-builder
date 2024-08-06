import ProfileService from "../../services/profile.service";
import ProfileRepository from "../../infrastructure/profileRepository";
import FileRepository from "../../infrastructure/fileRepository";
import entityMapper from "../../helpers/entityMapper";

jest.mock("../../infrastructure/profileRepository");
jest.mock("../../infrastructure/fileRepository");
jest.mock("../../helpers/entityMapper");

describe("ProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfiles", () => {
    it("should return sorted profiles", async () => {
      const mockRawProfiles = [{ id: 1 }, { id: 2 }];
      const mockMappedProfiles = [
        { id: 2, name: "Profile 2" },
        { id: 1, name: "Profile 1" },
      ];

      ProfileRepository.getAllProfiles.mockResolvedValue({
        profiles: mockRawProfiles,
        lastEvaluatedKey: null,
      });
      entityMapper.mapProfileData.mockReturnValue(mockMappedProfiles);

      const result = await ProfileService.getProfiles("draft", 10, null);

      expect(result).toEqual({
        profiles: mockMappedProfiles,
        lastEvaluatedKey: null,
      });
      expect(ProfileRepository.getAllProfiles).toHaveBeenCalledWith(
        "draft",
        10,
        null
      );
      expect(entityMapper.mapProfileData).toHaveBeenCalledWith(
        mockRawProfiles
      );
    });

    it("should return null when no profiles are found", async () => {
      ProfileRepository.getAllProfiles.mockResolvedValue({
        profiles: [],
        lastEvaluatedKey: null,
      });

      const result = await ProfileService.getProfiles("draft", 10, null);

      expect(result).toEqual({
        profiles: null,
        lastEvaluatedKey: null,
      });
    });

    it("should handle error", async () => {
      ProfileRepository.getAllProfiles.mockRejectedValue(new Error("DynamoDB error"));

      await expect(ProfileService.getProfiles("draft", 10, null)).rejects.toThrow("DynamoDB error");
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully", async () => {
      ProfileRepository.deleteProfile.mockResolvedValue(true);

      const result = await ProfileService.deleteProfile("test-slug");

      expect(result).toBe(true);
      expect(ProfileRepository.deleteProfile).toHaveBeenCalledWith("test-slug");
    });

    it("should handle error", async () => {
      ProfileRepository.deleteProfile.mockRejectedValue(new Error("DynamoDB error"));

      await expect(ProfileService.deleteProfile("test-slug")).rejects.toThrow("DynamoDB error");
    });
  });

  describe("uploadFile", () => {
    it("should upload file successfully", async () => {
      const mockFile = {
        buffer: Buffer.from("test"),
        originalname: "test.jpg",
      };
      const mockUploadResult = { Location: "https://example.com/test.jpg" };

      FileRepository.uploadFile.mockResolvedValue(mockUploadResult);

      const result = await ProfileService.uploadFile(
        mockFile,
        "publicBucket",
        "photo",
        "test-slug"
      );

      expect(result).toEqual(mockUploadResult);
      expect(FileRepository.uploadFile).toHaveBeenCalledWith(
        mockFile,
        "publicBucket",
        "photo",
        "test-slug"
      );
    });

    it("should handle error", async () => {
      const mockFile = {
        buffer: Buffer.from("test"),
        originalname: "test.jpg",
      };
      FileRepository.uploadFile.mockRejectedValue(new Error("S3 error"));

      await expect(
        ProfileService.uploadFile(mockFile, "publicBucket", "photo", "test-slug")
      ).rejects.toThrow("S3 error");
    });
  });

  describe("deleteFile", () => {
    it("should delete file and update profile attribute successfully", async () => {
      ProfileRepository.updateProfileAttribute.mockResolvedValue(true);
      FileRepository.deleteFile.mockResolvedValue({});

      const result = await ProfileService.deleteFile("test-slug", "photo", "test.jpg");

      expect(result).toEqual({});
      expect(ProfileRepository.updateProfileAttribute).toHaveBeenCalledWith(
        "test-slug",
        "photo",
        ""
      );
      expect(FileRepository.deleteFile).toHaveBeenCalledWith("test.jpg");
    });

    it("should handle error when updating profile attribute", async () => {
      ProfileRepository.updateProfileAttribute.mockRejectedValue(new Error("DynamoDB error"));

      await expect(
        ProfileService.deleteFile("test-slug", "photo", "test.jpg")
      ).rejects.toThrow("DynamoDB error");
    });

    it("should handle error when deleting file", async () => {
      ProfileRepository.updateProfileAttribute.mockResolvedValue(true);
      FileRepository.deleteFile.mockRejectedValue(new Error("S3 error"));

      await expect(
        ProfileService.deleteFile("test-slug", "photo", "test.jpg")
      ).rejects.toThrow("S3 error");
    });
  });

  describe("createProfile", () => {
    it("should create profile successfully", async () => {
      const mockBody = { name: "Test Profile" };
      const mockUploadedFiles = {
        photo: { Location: "https://example.com/photo.jpg" },
      };
      const mockProfile = {
        id: 1,
        name: "Test Profile",
        photoUrl: "https://example.com/photo.jpg",
      };

      entityMapper.mapNewProfile.mockReturnValue(mockProfile);
      ProfileRepository.createProfile.mockResolvedValue(true);

      const result = await ProfileService.createProfile(
        mockBody,
        mockUploadedFiles
      );

      expect(result).toEqual(mockProfile);
      expect(ProfileRepository.createProfile).toHaveBeenCalledWith(mockProfile);
    });

    it("should handle error", async () => {
      const mockBody = { name: "Test Profile" };
      const mockUploadedFiles = {
        photo: { Location: "https://example.com/photo.jpg" },
      };
      const mockProfile = {
        id: 1,
        name: "Test Profile",
        photoUrl: "https://example.com/photo.jpg",
      };

      entityMapper.mapNewProfile.mockReturnValue(mockProfile);
      ProfileRepository.createProfile.mockRejectedValue(new Error("DynamoDB error"));

      await expect(
        ProfileService.createProfile(mockBody, mockUploadedFiles)
      ).rejects.toThrow("DynamoDB error");
    });
  });

  describe("getProfile", () => {
    it("should return a mapped profile with signed URLs", async () => {
      const mockProfile = {
        pk: "TEST_PK",
        sk: "TEST_PK#test-slug",
        firstName: "John",
        photo: "photo.jpg",
        cv: "cv.pdf",
        coverLetter: "coverLetter.pdf",
        linkedInPage: "linkedInPage.pdf",
      };
      const mockMappedProfile = {
        firstName: "John",
        photo: "https://talents-photos.s3.eu-north-1.amazonaws.com/photo.jpg",
        cv: "https://example.com/cv.pdf",
        coverLetter: "https://example.com/coverLetter.pdf",
        linkedInPage: "https://example.com/linkedInPage.pdf",
      };

      ProfileRepository.getProfile.mockResolvedValue(mockProfile);
      entityMapper.mapSingleProfile.mockReturnValue(mockMappedProfile);
      FileRepository.getSignedUrl
        .mockResolvedValueOnce("https://example.com/cv.pdf")
        .mockResolvedValueOnce("https://example.com/coverLetter.pdf")
        .mockResolvedValueOnce("https://example.com/linkedInPage.pdf");

      const result = await ProfileService.getProfile("test-slug");

      expect(result).toEqual(mockMappedProfile);
      expect(ProfileRepository.getProfile).toHaveBeenCalledWith("test-slug");
      expect(entityMapper.mapSingleProfile).toHaveBeenCalledWith(mockProfile);
      expect(FileRepository.getSignedUrl).toHaveBeenCalledTimes(3);
    });

    it("should return null if profile does not exist", async () => {
      ProfileRepository.getProfile.mockResolvedValue(null);

      const result = await ProfileService.getProfile("non-existing-slug");

      expect(result).toBe(null);
    });

    it("should handle error", async () => {
      ProfileRepository.getProfile.mockRejectedValue(new Error("DynamoDB error"));

      await expect(ProfileService.getProfile("error-slug")).rejects.toThrow("DynamoDB error");
    });
  });

  describe("checkProfileExists", () => {
    it("should return true if profile exists", async () => {
      ProfileRepository.checkProfileExists.mockResolvedValue(true);

      const result = await ProfileService.checkProfileExists("existing-slug");

      expect(result).toBe(true);
    });

    it("should return false if profile does not exist", async () => {
      ProfileRepository.checkProfileExists.mockResolvedValue(false);

      const result = await ProfileService.checkProfileExists("non-existing-slug");

      expect(result).toBe(false);
    });

    it("should handle error", async () => {
      ProfileRepository.checkProfileExists.mockRejectedValue(new Error("DynamoDB error"));

      await expect(ProfileService.checkProfileExists("error-slug")).rejects.toThrow("DynamoDB error");
    });
  });

  describe("updatedProfile", () => {
    it("should update profile attributes successfully", async () => {
      const mockBody = {
        oldSlug: "test-slug",
        slug: "test-slug",
        firstName: "John",
        lastName: "Doe",
        photo: "photo.jpg",
        cvUrl: "cv.pdf",
      };
      const mockUploadedFiles = {};
      const mockOldItem = {
        pk: "TEST_PK",
        sk: "TEST_PK#test-slug",
        firstName: "Jane",
        lastName: "Smith",
        photo: "old_photo.jpg",
        cv: "old_cv.pdf",
      };
      const mockUpdatedProfile = {
        ...mockOldItem,
        firstName: "John",
        lastName: "Doe",
        photo: "photo.jpg",
        cv: "cv.pdf",
      };

      entityMapper.mapNewProfile.mockReturnValue(mockUpdatedProfile);
      ProfileRepository.getProfile.mockResolvedValue(mockOldItem);
      ProfileRepository.updatedProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await ProfileService.updatedProfile(mockBody, mockUploadedFiles);

      expect(result).toEqual(mockUpdatedProfile);
      expect(ProfileRepository.getProfile).toHaveBeenCalledWith(mockBody.oldSlug);
      expect(ProfileRepository.updatedProfile).toHaveBeenCalled();
    });

    it("should handle profile not found", async () => {
      const mockBody = { oldSlug: "test-slug" };
      const mockUploadedFiles = {};

      ProfileRepository.getProfile.mockResolvedValue(null);

      const result = await ProfileService.updatedProfile(mockBody, mockUploadedFiles);

      expect(result).toBeUndefined();
      expect(ProfileRepository.getProfile).toHaveBeenCalledWith(mockBody.oldSlug);
    });

    it("should handle error", async () => {
      const mockBody = {
        oldSlug: "test-slug",
        slug: "test-slug",
        firstName: "John",
        lastName: "Doe",
        photo: "photo.jpg",
        cvUrl: "cv.pdf",
      };
      const mockUploadedFiles = {};
      const mockOldItem = {
        pk: "TEST_PK",
        sk: "TEST_PK#test-slug",
        firstName: "Jane",
        lastName: "Smith",
        photo: "old_photo.jpg",
        cv: "old_cv.pdf",
      };

      entityMapper.mapNewProfile.mockReturnValue(mockBody);
      ProfileRepository.getProfile.mockResolvedValue(mockOldItem);
      ProfileRepository.updatedProfile.mockRejectedValue(new Error("DynamoDB error"));

      await expect(
        ProfileService.updatedProfile(mockBody, mockUploadedFiles)
      ).rejects.toThrow("DynamoDB error");
    });

    it("should update slug if changed", async () => {
      const mockBody = {
        oldSlug: "old-slug",
        slug: "new-slug",
        firstName: "John",
        lastName: "Doe",
        photo: "photo.jpg",
        cvUrl: "cv.pdf",
      };
      const mockUploadedFiles = {};
      const mockOldItem = {
        pk: "TEST_PK",
        sk: "TEST_PK#old-slug",
        firstName: "Jane",
        lastName: "Smith",
        photo: "old_photo.jpg",
        cv: "old_cv.pdf",
      };
      const mockUpdatedProfile = {
        ...mockOldItem,
        firstName: "John",
        lastName: "Doe",
        photo: "photo.jpg",
        cv: "cv.pdf",
      };

      entityMapper.mapNewProfile.mockReturnValue(mockUpdatedProfile);
      ProfileRepository.getProfile.mockResolvedValue(mockOldItem);
      ProfileRepository.updatedProfile.mockResolvedValue(mockUpdatedProfile);
      ProfileRepository.createProfile.mockResolvedValue(true);
      ProfileRepository.deleteProfile.mockResolvedValue(true);

      const result = await ProfileService.updatedProfile(mockBody, mockUploadedFiles);

      expect(result.slug).toBe("new-slug");
      expect(ProfileRepository.createProfile).toHaveBeenCalledWith({
        ...mockUpdatedProfile,
        pk: "TEST_PK",
        sk: "TEST_PK#new-slug",
        slug: "new-slug",
      });
      expect(ProfileRepository.deleteProfile).toHaveBeenCalledWith("old-slug");
    });
  });
});
