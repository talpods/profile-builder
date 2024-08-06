import ProfileUseCase from "../usecases/ProfileUseCase.js";
import UpdatedProfileUseCase from "../usecases/updateProfileUseCase.js";
import createProfileUseCase from "../usecases/createProfileUseCase.js";
import { validateToken } from "../helpers/validateToken.js";
import ProfileService from "../services/profile.service.js";

class profileController {
  static async getProfiles(req, res) {
    try {
      const validationResult = await validateToken(
        req.headers.authorization,
        req.headers.refreshtoken
      );
      if (validationResult) {
        const limit = parseInt(req.query.limit, 5) || 5;
        const lastEvaluatedKey = req.query.lastEvaluatedKey
          ? JSON.parse(req.query.lastEvaluatedKey)
          : null;
        const status = req.query.status;

        const { profiles, lastEvaluatedKey: newLastEvaluatedKey } =
          await ProfileUseCase.getAllProfiles(status, limit, lastEvaluatedKey);

        res.send({ profiles, lastEvaluatedKey: newLastEvaluatedKey });
      }
    } catch (error) {
      if (error.message === "Invalid token") {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        res.status(500).send(`Error: ${error.message}`);
      }
    }
  }

  static async getProfile(req, res) {
    const profile = await ProfileService.getProfile(req.query.slug);
    if (!profile) {
      return res.send("Profile not found");
    }
    res.send(profile);
  }

  static async deleteProfile(req, res) {
    try {
      const profileSlug = req.params.slug;
      const result = await ProfileService.deleteProfile(profileSlug);
      if (!result) {
        return res.send("Profile not found");
      }
      res.send("Profile deleted successfully");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async createProfile(req, res) {
    const validationResult = await validateToken(
      req.headers.authorization,
      req.headers.refreshtoken
    );
    if (validationResult) {
      try {
        const profileSlug = req.body.slug;
        const profileExists = await ProfileService.checkProfileExists(
          profileSlug
        );
        if (profileExists) {
          return res.send("Profile already exists");
        }
        const result = await createProfileUseCase.createProfile(req);
        res
          .status(201)
          .json({ message: "Profile submitted successfully.", data: result });
      } catch (error) {
        res
          .status(error.statusCode || 500)
          .json({ error: error.message, details: error.details });
      }
    }
  }

  static async getProfileData(req, res) {
    try {
      const { slug } = req.params;

      const profile = await ProfileService.getProfileData(slug);

      res.json(profile);
    } catch (error) {
      console.error("Error in getProfile:", error);
      res
        .status(error.message.includes("not found") ? 404 : 500)
        .json({ error: error.message });
    }
  }

  static async updateProfileData(req, res) {
    try {
      const { slug } = req.params;
      const { path } = req.body;
      const { updatedData } = req.body;

      const updatedProfile = await ProfileService.updateProfileData(
        slug,
        path,
        updatedData
      );
      res.json(updatedProfile);
    } catch (error) {
      console.error("Error in updateProfile:", error);
      res
        .status(error.message.includes("not found") ? 404 : 500)
        .json({ error: error.message });
    }
  }
  static async regenerateAndUpdateProfile(req, res) {
    try {
      const { slug } = req.params;
      const { propertyName } = req.body;
      const { generateType } = req.body;
      const { updatedData } = req.body;

      const updatedProfile = await ProfileService.regenerateAndUpdateProfile(
        slug,
        generateType,
        propertyName,
        updatedData
      );

      res.json(updatedProfile);
    } catch (error) {
      return res
        .status(error.message.includes("not found") ? 404 : 500)
        .json({ error: error.message });
    }
  }
  static async updateProfile(req, res) {
    try {
      const result = await UpdatedProfileUseCase.updatedProfile(req);
      res
        .status(201)
        .json({ message: "Profile updated successfully.", data: result });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ error: error.message, details: error.details });
    }
  }

  static async recreateProfile(req, res) {
    try {
      const result = await UpdatedProfileUseCase.recreateProfile(req);
      res
        .status(201)
        .json({ message: "Profile recreated successfully.", data: result });
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ error: error.message, details: error.details });
    }
  }
}

export default profileController;
