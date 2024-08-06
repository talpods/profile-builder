const ProfileRepository = require("../infrastructure/profileRepository.js");

class ProfileUseCase {
  static async getProfile(slug) {
    try {
      const profile = await ProfileRepository.getProfileBySlug(slug);
      if (!profile) {
        throw new Error("Profile not found");
      }
      return profile;
    } catch (error) {
      console.error("Error getting profile:", error.message);
      throw error;
    }
  }

  static async updateProfile(slug, updateData) {
    try {
      const updatedProfile = await ProfileRepository.updateProfile(
        slug,
        updateData
      );
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
  }
}
module.exports = ProfileUseCase;
