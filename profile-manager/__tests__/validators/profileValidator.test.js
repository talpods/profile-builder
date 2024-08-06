import ProfileValidator from "../../validators/profileValidator";
import { config } from "../../config/config";

jest.mock("../../config/config", () => ({
  config: {
    allowedImageFormats: ["image/jpeg", "image/png"],
    allowedDocFormats: ["application/pdf", "application/msword"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
}));

describe("ProfileValidator", () => {
  describe("validateInputs", () => {
    it("should pass for valid inputs", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        levelOfExperience: "Senior",
        targetRole: "Developer",
        profileNumber: "12345",
        slug: "john-doe",
        scoreSheetLink: "https://example.com/scoresheet",
        linkedInLink: "https://linkedin.com/in/johndoe",
        githubLink: "https://github.com/johndoe",
        email: "john.doe@example.com"
      };

      await expect(
        ProfileValidator.validateInputs(validData)
      ).resolves.not.toThrow();
    });

    it("should throw error for missing required fields", async () => {
      const invalidData = {
        firstName: "John",
      };

      await expect(
        ProfileValidator.validateInputs(invalidData)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for invalid URL fields", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        levelOfExperience: "Senior",
        targetRole: "Developer",
        profileNumber: "12345",
        slug: "john-doe",
        scoreSheetLink: "invalid-url",
        linkedInLink: "invalid-url",
        githubLink: "invalid-url",
        email: "john.doe@example.com"
      };

      await expect(
        ProfileValidator.validateInputs(invalidData)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for invalid slug format", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        levelOfExperience: "Senior",
        targetRole: "Developer",
        profileNumber: "12345",
        slug: "invalid_slug",
        scoreSheetLink: "https://example.com/scoresheet",
        email: "john.doe@example.com"
      };

      await expect(
        ProfileValidator.validateInputs(invalidData)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for invalid email format", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        levelOfExperience: "Senior",
        targetRole: "Developer",
        profileNumber: "12345",
        slug: "john-doe",
        scoreSheetLink: "https://example.com/scoresheet",
        email: "invalid-email"
      };

      await expect(
        ProfileValidator.validateInputs(invalidData)
      ).rejects.toThrow("Validation failed.");
    });
  });

  describe("validateFiles", () => {
    it("should pass for valid files", async () => {
      const validFiles = {
        photo: [{ mimetype: "image/jpeg", size: 1000000, fieldname: "photo" }],
        cv: [{ mimetype: "application/pdf", size: 2000000, fieldname: "cv" }],
        coverLetter: [
          {
            mimetype: "application/pdf",
            size: 1500000,
            fieldname: "coverLetter",
          },
        ],
        linkedInPage: [
          {
            mimetype: "application/pdf",
            size: 1800000,
            fieldname: "linkedInPage",
          },
        ],
      };

      await expect(
        ProfileValidator.validateFiles(validFiles)
      ).resolves.not.toThrow();
    });

    it("should throw error for missing required files", async () => {
      const invalidFiles = {
        cv: [{ mimetype: "application/pdf", size: 2000000, fieldname: "cv" }],
      };

      await expect(
        ProfileValidator.validateFiles(invalidFiles)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for invalid file types", async () => {
      const invalidFiles = {
        photo: [{ mimetype: "image/gif", size: 1000000, fieldname: "photo" }],
        cv: [{ mimetype: "application/pdf", size: 2000000, fieldname: "cv" }],
        coverLetter: [
          {
            mimetype: "application/pdf",
            size: 1500000,
            fieldname: "coverLetter",
          },
        ],
        linkedInPage: [
          {
            mimetype: "application/pdf",
            size: 1800000,
            fieldname: "linkedInPage",
          },
        ],
      };

      await expect(
        ProfileValidator.validateFiles(invalidFiles)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for files exceeding size limit", async () => {
      const invalidFiles = {
        photo: [{ mimetype: "image/jpeg", size: 10000000, fieldname: "photo" }],
        cv: [{ mimetype: "application/pdf", size: 2000000, fieldname: "cv" }],
        coverLetter: [
          {
            mimetype: "application/pdf",
            size: 1500000,
            fieldname: "coverLetter",
          },
        ],
        linkedInPage: [
          {
            mimetype: "application/pdf",
            size: 1800000,
            fieldname: "linkedInPage",
          },
        ],
      };

      await expect(
        ProfileValidator.validateFiles(invalidFiles)
      ).rejects.toThrow("Validation failed.");
    });
  });

  describe("validateUpdatedFiles", () => {
    it("should pass for valid files", async () => {
      const validFiles = {
        photo: [{ mimetype: "image/jpeg", size: 1000000, fieldname: "photo" }],
        cv: [{ mimetype: "application/pdf", size: 2000000, fieldname: "cv" }],
        coverLetter: [
          {
            mimetype: "application/pdf",
            size: 1500000,
            fieldname: "coverLetter",
          },
        ],
        linkedInPage: [
          {
            mimetype: "application/pdf",
            size: 1800000,
            fieldname: "linkedInPage",
          },
        ],
      };

      await expect(
        ProfileValidator.validateUpdatedFiles(validFiles)
      ).resolves.not.toThrow();
    });

    it("should pass if no files are provided", async () => {
      const noFiles = {};

      await expect(
        ProfileValidator.validateUpdatedFiles(noFiles)
      ).resolves.not.toThrow();
    });

    it("should throw error for invalid file types", async () => {
      const invalidFiles = {
        photo: [{ mimetype: "image/gif", size: 1000000, fieldname: "photo" }],
      };

      await expect(
        ProfileValidator.validateUpdatedFiles(invalidFiles)
      ).rejects.toThrow("Validation failed.");
    });

    it("should throw error for files exceeding size limit", async () => {
      const invalidFiles = {
        photo: [{ mimetype: "image/jpeg", size: 10000000, fieldname: "photo" }],
      };

      await expect(
        ProfileValidator.validateUpdatedFiles(invalidFiles)
      ).rejects.toThrow("Validation failed.");
    });
  });
});
