import CreateProfileUseCase from "../../usecases/createProfileUseCase";
import profileValidator from "../../validators/profileValidator";
import ProfileService from "../../services/profile.service";
import FileUploadHelper from "../../helpers/fileUploadHelper";
import NotificationService from "../../services/notificationService";

jest.mock("../../validators/profileValidator");
jest.mock("../../services/profile.service");
jest.mock("../../helpers/fileUploadHelper");
jest.mock("../../services/notificationService");

describe("CreateProfileUseCase", () => {
  let mockReq;

  beforeEach(() => {
    mockReq = {
      body: {
        firstName: "John",
        lastName: "Doe",
        levelOfExperience: "Senior",
        targetRole: "Developer",
        profileNumber: "12345",
        slug: "john-doe",
        scoreSheetLink: "https://example.com/scoresheet",
      },
      files: {
        photo: [{ buffer: Buffer.from("photo"), mimetype: "image/jpeg" }],
        cv: [{ buffer: Buffer.from("cv"), mimetype: "application/pdf" }],
        coverLetter: [
          { buffer: Buffer.from("coverLetter"), mimetype: "application/pdf" },
        ],
        linkedInPage: [
          { buffer: Buffer.from("linkedInPage"), mimetype: "application/pdf" },
        ],
      },
    };
  });

  it("should create profile successfully", async () => {
    profileValidator.validateInputs.mockResolvedValue();
    profileValidator.validateFiles.mockResolvedValue();

    const mockUploadedFiles = {
      photo: { Location: "https://example.com/photo.jpg" },
      cv: { Location: "https://example.com/cv.pdf" },
      coverLetter: { Location: "https://example.com/cover-letter.pdf" },
      linkedInPage: { Location: "https://example.com/linkedin-page.pdf" },
    };
    FileUploadHelper.handleFileUpload.mockResolvedValue(mockUploadedFiles);

    const mockCreatedProfile = {
      ...mockReq.body,
      photoUrl: mockUploadedFiles.photo.Location,
      cvUrl: mockUploadedFiles.cv.Location,
      coverLetterUrl: mockUploadedFiles.coverLetter.Location,
      linkedInPageUrl: mockUploadedFiles.linkedInPage.Location,
    };
    ProfileService.createProfile.mockResolvedValue(mockCreatedProfile);

    NotificationService.sendProfileCreatedNotification.mockResolvedValue();

    const result = await CreateProfileUseCase.createProfile(mockReq);

    expect(profileValidator.validateInputs).toHaveBeenCalledWith(mockReq.body);
    expect(profileValidator.validateFiles).toHaveBeenCalledWith(mockReq.files);
    expect(FileUploadHelper.handleFileUpload).toHaveBeenCalledWith(
      mockReq.files.photo[0],
      mockReq.files.cv[0],
      mockReq.files.coverLetter[0],
      mockReq.files.linkedInPage[0],
      mockReq.body.profileNumber
    );
    expect(ProfileService.createProfile).toHaveBeenCalledWith(
      mockReq.body,
      mockUploadedFiles
    );
    expect(
      NotificationService.sendProfileCreatedNotification
    ).toHaveBeenCalledWith(mockCreatedProfile);
    expect(result).toEqual(mockCreatedProfile);
  });

  it("should throw error if input validation fails", async () => {
    profileValidator.validateInputs.mockRejectedValue(
      new Error("Input validation failed")
    );

    await expect(CreateProfileUseCase.createProfile(mockReq)).rejects.toThrow(
      "Input validation failed"
    );
  });

  it("should throw error if file validation fails", async () => {
    profileValidator.validateInputs.mockResolvedValue();
    profileValidator.validateFiles.mockRejectedValue(
      new Error("File validation failed")
    );

    await expect(CreateProfileUseCase.createProfile(mockReq)).rejects.toThrow(
      "File validation failed"
    );
  });

  it("should handle file upload failure", async () => {
    profileValidator.validateInputs.mockResolvedValue();
    profileValidator.validateFiles.mockResolvedValue();
    FileUploadHelper.handleFileUpload.mockRejectedValue(
      new Error("File upload failed")
    );

    await expect(CreateProfileUseCase.createProfile(mockReq)).rejects.toThrow(
      "File upload failed"
    );
  });

  it("should handle profile creation failure", async () => {
    profileValidator.validateInputs.mockResolvedValue();
    profileValidator.validateFiles.mockResolvedValue();
    FileUploadHelper.handleFileUpload.mockResolvedValue({});
    ProfileService.createProfile.mockRejectedValue(
      new Error("Profile creation failed")
    );

    await expect(CreateProfileUseCase.createProfile(mockReq)).rejects.toThrow(
      "Profile creation failed"
    );
  });

  it("should handle notification failure but still create profile", async () => {
    profileValidator.validateInputs.mockResolvedValue();
    profileValidator.validateFiles.mockResolvedValue();
    FileUploadHelper.handleFileUpload.mockResolvedValue({});
    const mockCreatedProfile = { slug: "test-slug" };
    ProfileService.createProfile.mockResolvedValue(mockCreatedProfile);
    NotificationService.sendProfileCreatedNotification.mockRejectedValue(
      new Error("Notification failed")
    );

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await CreateProfileUseCase.createProfile(mockReq);

    expect(result).toEqual(mockCreatedProfile);
    expect(
      NotificationService.sendProfileCreatedNotification
    ).toHaveBeenCalledWith(mockCreatedProfile);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to send notification: Notification failed"
    );

    consoleSpy.mockRestore();
  });
});
