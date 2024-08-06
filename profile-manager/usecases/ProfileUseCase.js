import ProfileService from "../services/profile.service.js";

class ProfileUseCase {
  static async getAllProfiles(status, limit, lastEvaluatedKey) {
    const { profiles, lastEvaluatedKey: newLastEvaluatedKey } =
      await ProfileService.getProfiles(status, limit, lastEvaluatedKey);
    if (!profiles) {
      return { profiles: [], lastEvaluatedKey: null };
    }
    return { profiles, lastEvaluatedKey: newLastEvaluatedKey };
  }
}
export default ProfileUseCase;
