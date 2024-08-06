import Profile from "../entities/profile.js";
import User from "../entities/User.js";
import NewProfile from "../entities/newProfile.js";
import SingleProfile from "../entities/singleProfile.js";

class entityMapper {
	static mapProfileData(rawProfiles) {
		const profileList = rawProfiles.map(
			(rawProfile) => new Profile(rawProfile)
		);
		return profileList;
	}

	static mapSingleProfile(rawProfile) {
		const profile = new SingleProfile(rawProfile);
		return profile;
	}


	static mapUserData(userData) {
		const user = new User(userData);
		return user;
	}

	static mapNewProfile(data, files) {
		const newProfile = new NewProfile(data, files);
		return newProfile;
	}
}

export default entityMapper;
