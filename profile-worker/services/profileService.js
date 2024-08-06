const ProfileRepository = require("../infrastructure/profileRepository.js");

class ProfileService {
  //Check if profile exists
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
  //Update the profile after getting all the data from teh open ai serivce
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

  //this method to update profile property mainly will be used to update the status of the profile while generating.
  static async updateProfileProperty(slug, propertyName, propertyValue) {
    try {
      const result = await ProfileRepository.updateProfileProperty(
        slug,
        propertyName,
        propertyValue
      );
      return result;
    } catch (error) {
      console.error("Error updating profile property:", error.message);
      throw error;
    }
  }
}
module.exports = ProfileService;
