import ProfileRepository from "../infrastructure/profileRepository.js";
import FileRepository from "../infrastructure/fileRepository.js";
import entityMapper from "../helpers/entityMapper.js";
import { config } from "../config/config.js";

class ProfileService {
	static async getProfiles(status, limit, lastEvaluatedKey) {
		const { profiles: rawProfiles, lastEvaluatedKey: newLastEvaluatedKey } =
			await ProfileRepository.getAllProfiles(status, limit, lastEvaluatedKey);

		if (!rawProfiles.length) {
			return { profiles: null, lastEvaluatedKey: null };
		}
		const sortedProfileList = entityMapper.mapProfileData(rawProfiles);

		return {
			profiles: sortedProfileList,
			lastEvaluatedKey: newLastEvaluatedKey,
		};
	}

	static async deleteProfile(slug) {
		const result = await ProfileRepository.deleteProfile(slug);
		return result;
	}

	static async uploadFile(file, bucket, fileType, profileNumber) {
		const data = await FileRepository.uploadFile(
			file,
			bucket,
			fileType,
			profileNumber
		);
		return data;
	}

	static async deleteFile(slug, fileType, fileName) {
		const newValue = "";
		await ProfileRepository.updateProfileAttribute(slug, fileType, newValue);
		const data = await FileRepository.deleteFile(fileName);
		return data;
	}

	static async createProfile(body, uploadedFiles) {
		const profile = entityMapper.mapNewProfile(body, uploadedFiles);
		await ProfileRepository.createProfile(profile);
		return profile;
	}

	static async getProfile(slug) {
		const result = await ProfileRepository.getProfile(slug);
		if (!result) {
			return null;
		}
		const profile = entityMapper.mapSingleProfile(result);
		profile["photo"] = `${config.publicBucketLink}${profile.photo}`;
		profile["cv"] = await FileRepository.getSignedUrl(profile.cv);

		if (profile.coverLetter)
			profile["coverLetter"] = await FileRepository.getSignedUrl(
				profile.coverLetter
			);
		if (profile.linkedInPage)
			profile["linkedInPage"] = await FileRepository.getSignedUrl(
				profile.linkedInPage
			);

		return profile;
	}

	static async checkProfileExists(slug) {
		const profileExists = await ProfileRepository.checkProfileExists(slug);
		if (profileExists) {
			return true;
		}
		return false;
	}

	static async getProfileData(slug) {
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

	static async updateProfileData(slug, path, data) {
		try {
			const result = await ProfileRepository.updateProfileData(
				slug,
				path,
				data
			);
			return result;
		} catch (error) {
			throw new Error(`Error updating profile property: ${error.message}`);
		}
	}

	static async regenerateAndUpdateProfile(slug, generateType, property, data) {
		try {
			const content = await ProfileRepository.regenerateAndUpdateProfile(
				slug,
				generateType,
				property,
				data
			);
			return content;
		} catch (error) {
			throw new Error(`Error updating profile property: ${error.message}`);
		}
	}
	static async updatedProfile(body, uploadedFiles) {
		const profile = entityMapper.mapNewProfile(body, uploadedFiles);
		const oldItem = await ProfileRepository.getProfile(body.oldSlug);

		if (!oldItem) return res.status(404).json({ error: "Profile not found" });

		let updateExpression = "set";
		let ExpressionAttributeNames = {};
		let ExpressionAttributeValues = {};

    const fields = Object.fromEntries(
      Object.entries(profile).filter(([key]) =>
        !["pk", "sk", "slug", "error", "status", "profileNumber"].includes(key)
      )
    );

		for (let key in fields) {
			if (fields[key] !== oldItem[key]) {
				if (
					(key === "photo" ||
						key === "cvUrl" ||
						key === "coverLetterUrl" ||
						key === "linkedInProfile") &&
					fields[key] === ""
				) {
					continue;
				}
				updateExpression += ` #${key} = :${key},`;
				ExpressionAttributeNames[`#${key}`] = key;
				ExpressionAttributeValues[`:${key}`] = fields[key];
			}
		}
		const result = await ProfileRepository.updatedProfile(
			body.oldSlug,
			updateExpression,
			ExpressionAttributeNames,
			ExpressionAttributeValues
		);

		if (profile.slug !== body.oldSlug) {
			const newResult = Object.fromEntries(
				Object.entries(result).filter(
					([key]) => !["pk", "sk", "slug"].includes(key)
				)
			);

			const newProfile = {
				...newResult, // Copy existing properties
				pk: config.primaryKey, // Update pk
				sk: `${config.primaryKey}#${profile.slug}`, // Update sk
				slug: profile.slug, // Update slug
			};
			await ProfileRepository.createProfile(newProfile);
			await ProfileRepository.deleteProfile(body.oldSlug);
			console.log(newProfile);
			return newProfile;
		}
		return result;
	}
}

export default ProfileService;
