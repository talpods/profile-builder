import profileController from "../../controllers/profileController";
import ProfileService from "../../services/profile.service";
import ProfileUseCase from "../../usecases/ProfileUseCase";
import UpdatedProfileUseCase from "../../usecases/updateProfileUseCase";
import createProfileUseCase from "../../usecases/createProfileUseCase";
import { validateToken } from "../../helpers/validateToken";

jest.mock("../../services/profile.service");
jest.mock("../../usecases/ProfileUseCase");
jest.mock("../../usecases/updateProfileUseCase");
jest.mock("../../usecases/createProfileUseCase");
jest.mock("../../helpers/validateToken");

describe("profileController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer token",
        refreshtoken: "refresh-token",
      },
      query: {},
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  describe("getProfiles", () => {
    it("should get profiles successfully", async () => {
      validateToken.mockResolvedValue(true);
      ProfileUseCase.getAllProfiles.mockResolvedValue({
        profiles: [{ id: 1, name: "Test Profile" }],
        lastEvaluatedKey: null,
      });

      await profileController.getProfiles(req, res);

      expect(res.send).toHaveBeenCalledWith({
        profiles: [{ id: 1, name: "Test Profile" }],
        lastEvaluatedKey: null,
      });
    });

    it("should handle invalid token", async () => {
      validateToken.mockRejectedValue(new Error("Invalid token"));

      await profileController.getProfiles(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Unauthorized: Invalid token");
    });

    it("should handle other errors", async () => {
      validateToken.mockRejectedValue(new Error("Some other error"));

      await profileController.getProfiles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error: Some other error");
    });
  });

  describe("getProfile", () => {
    it("should get profile successfully", async () => {
      req.query.slug = "test-slug";
      ProfileService.getProfile.mockResolvedValue({ id: 1, name: "Test Profile" });

      await profileController.getProfile(req, res);

      expect(res.send).toHaveBeenCalledWith({ id: 1, name: "Test Profile" });
    });

    it("should handle non-existent profile", async () => {
      req.query.slug = "non-existent-slug";
      ProfileService.getProfile.mockResolvedValue(null);

      await profileController.getProfile(req, res);

      expect(res.send).toHaveBeenCalledWith("Profile not found");
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully", async () => {
      req.params.slug = "test-slug";
      ProfileService.deleteProfile.mockResolvedValue(true);

      await profileController.deleteProfile(req, res);

      expect(res.send).toHaveBeenCalledWith("Profile deleted successfully");
    });

    it("should handle non-existent profile", async () => {
      req.params.slug = "non-existent-slug";
      ProfileService.deleteProfile.mockResolvedValue(false);

      await profileController.deleteProfile(req, res);

      expect(res.send).toHaveBeenCalledWith("Profile not found");
    });

    it("should handle errors", async () => {
      req.params.slug = "test-slug";
      ProfileService.deleteProfile.mockRejectedValue(new Error("Some error"));

      await profileController.deleteProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Some error");
    });
  });

  describe("createProfile", () => {
    it("should create profile successfully", async () => {
      validateToken.mockResolvedValue(true);
      req.body.slug = "new-profile";
      ProfileService.checkProfileExists.mockResolvedValue(false);
      createProfileUseCase.createProfile.mockResolvedValue({
        id: 1,
        name: "New Profile",
      });

      await profileController.createProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Profile submitted successfully.",
        data: { id: 1, name: "New Profile" },
      });
    });

    it("should handle existing profile", async () => {
      validateToken.mockResolvedValue(true);
      req.body.slug = "existing-profile";
      ProfileService.checkProfileExists.mockResolvedValue(true);

      await profileController.createProfile(req, res);

      expect(res.send).toHaveBeenCalledWith("Profile already exists");
    });

    it("should handle errors", async () => {
      validateToken.mockResolvedValue(true);
      req.body.slug = "new-profile";
      ProfileService.checkProfileExists.mockResolvedValue(false);
      createProfileUseCase.createProfile.mockRejectedValue(new Error("Some error"));

      await profileController.createProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Some error",
        details: undefined,
      });
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      UpdatedProfileUseCase.updatedProfile.mockResolvedValue({
        id: 1,
        name: "Updated Profile",
      });

      await profileController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Profile updated successfully.",
        data: { id: 1, name: "Updated Profile" },
      });
    });

    it("should handle errors", async () => {
      UpdatedProfileUseCase.updatedProfile.mockRejectedValue(new Error("Some error"));

      await profileController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Some error",
        details: undefined,
      });
    });
  });

  describe("recreateProfile", () => {
    it("should recreate profile successfully", async () => {
      UpdatedProfileUseCase.recreateProfile.mockResolvedValue({
        id: 1,
        name: "Recreated Profile",
      });

      await profileController.recreateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Profile recreated successfully.",
        data: { id: 1, name: "Recreated Profile" },
      });
    });

    it("should handle errors", async () => {
      UpdatedProfileUseCase.recreateProfile.mockRejectedValue(new Error("Some error"));

      await profileController.recreateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Some error",
        details: undefined,
      });
    });
  });
});
