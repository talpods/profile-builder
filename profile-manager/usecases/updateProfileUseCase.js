import profileValidator from "../validators/profileValidator.js";
import FileUploadHelper from "../helpers/fileUploadHelper.js";
import ProfileService from "../services/profile.service.js";
import NotificationService from "../services/notification.service.js";

class UpdatedProfile {
  static async updatedProfile(req) {
    const { body, files } = req;

    await profileValidator.validateInputs(body);
    await profileValidator.validateUpdatedFiles(files);

    const { photo, cv, coverLetter, linkedInPage } = files;
    const profileNumber = body.profileNumber;

    const photoFile = photo ? photo[0] : null;
    const cvFile = cv ? cv[0] : null;
    const coverLetterFile = coverLetter ? coverLetter[0] : null;
    const linkedInPageFile = linkedInPage ? linkedInPage[0] : null;

    const uploadedFiles = await FileUploadHelper.handleFileUpload(
      photoFile,
      cvFile,
      coverLetterFile,
      linkedInPageFile,
      profileNumber
    );

    const profile = await ProfileService.updatedProfile(body, uploadedFiles);
    return profile;
  }

  static async recreateProfile(req) {
    const slug = req.params.slug;
    const profile = await ProfileService.getProfile(slug);
    if (!profile) {
      throw new Error("Profile not found");
    }
    // Send SNS notification
    await NotificationService.sendProfileCreatedNotification(profile);

    return profile;
  }
}

export default UpdatedProfile;
