import { config } from "../config/config.js";
import validator from "validator";

class ProfileValidator {
  static async validateInputs(data) {
    const errors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "levelOfExperience",
      "targetRole",
      "profileNumber",
      "slug",
      "email"
    ];
    const urlFields = ["linkedInLink", "githubLink", "scoreSheetLink"];
    const slugRegex = /^[a-z]+-[a-z]+[0-9]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    requiredFields.forEach((field) => {
      if (!data[field])
        errors[field] = `${this.formatFieldName(field)} is required.`;
    });

    if (data.slug && !slugRegex.test(data.slug)) {
      errors.slug = "Invalid slug format";
    }

    if (data.email && !emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }

    urlFields.forEach((field) => {
      if(data[field] !== "null"){
      if (!validator.isURL(data[field])) {
        errors[field] = `Invalid ${this.formatFieldName(field)}.`;
      }
    }
    });

    this.throwIfErrors(errors);
  }

  static async validateFiles(files) {
    const errors = {};
    const requiredFiles = ["photo", "cv", "coverLetter", "linkedInPage"];

    requiredFiles.forEach((fileType) => {
      if (!files[fileType]) {
        if (fileType === "photo" || fileType === "cv") {
          errors[fileType] = `${this.formatFieldName(fileType)} is required.`;
        }
      } else {
        const file = files[fileType][0];
        this.validateFileType(file, fileType, errors);
        this.validateFileSize(file, errors);
      }
    });

    this.throwIfErrors(errors);
  }

  static async validateUpdatedFiles(files) {
    const errors = {};
    const requiredFiles = ["photo", "cv", "coverLetter", "linkedInPage"];

    requiredFiles.forEach((fileType) => {
      if (files[fileType]) {
        const file = files[fileType][0];
        this.validateFileType(file, fileType, errors);
        this.validateFileSize(file, errors);
      }
  });

    this.throwIfErrors(errors);
  }



  static validateFileType(file, fileType, errors) {
    const allowedFormats =
      fileType === "photo"
        ? config.allowedImageFormats
        : config.allowedDocFormats;
    if (!allowedFormats.includes(file.mimetype)) {
      errors[
        fileType
      ] = `Invalid ${fileType} format. Allowed formats: ${allowedFormats.join(
        ", "
      )}.`;
    }
  }

  static validateFileSize(file, errors) {
    if (file.size > config.maxSize) {
      errors[file.fieldname] = `${this.formatFieldName(
        file.fieldname
      )} size exceeds the limit of 5MB.`;
    }
  }

  static throwIfErrors(errors) {
    if (Object.keys(errors).length > 0) {
      throw new Error(
        JSON.stringify({
          statusCode: 400,
          message: "Validation failed.",
          details: errors,
        })
      );
    }
  }

  static formatFieldName(field) {
    if (!field) return "";
    return field
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase();
  }
}

export default ProfileValidator;
