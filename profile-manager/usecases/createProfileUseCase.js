import profileValidator from "../validators/profileValidator.js";
import ProfileService from "../services/profile.service.js";
import FileUploadHelper from "../helpers/fileUploadHelper.js";
import NotificationService from "../services/notificationService.js";

class CreateProfileUseCase {
  static async createProfile(req) {
    const { body, files } = req;

    await profileValidator.validateInputs(body);
    await profileValidator.validateFiles(files);

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

    const profile = await ProfileService.createProfile(body, uploadedFiles);

    // Send SNS notification
    await NotificationService.sendProfileCreatedNotification(profile);

    return profile;
  }
}
export default CreateProfileUseCase;
