import { config } from "../config/config.js";

class NewProfile {
  constructor(data, files) {
    this.pk = config.primaryKey;
    this.sk = `${config.primaryKey}#${data.slug}`;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.secondNameInitials = data.lastName[0];
    this.level = data.levelOfExperience;
    this.seniority = data.targetRole;
    this.linkedInProfile = files.linkedInPage
      ? files.linkedInPage.Key
      : "";
    this.githubLink = data.githubLink !== "null" ? data.githubLink : "";
    this.profileNumber = data.profileNumber;
    this.slug = data.slug;
    this.email = data.email;
    this.scoreSheetLink = data.scoreSheetLink !== "null" ? data.scoreSheetLink : "";
    this.status = "processing";
    this.stateModifiedAt = this.getCurrentDate();
    this.error = "";
    this.photo = files.photo ? files.photo.Key : "";
    this.cvUrl = files.cv ? files.cv.Key : "";
    this.coverLetterUrl = files.coverLetter ? files.coverLetter.Key : "";
    this.linkedInPageUrl =
      data.linkedInLink !== "null" ? data.linkedInLink : "";
  }

  getCurrentDate() {
    const padZero = (number) => (number < 10 ? "0" : "") + number;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = padZero(currentDate.getMonth() + 1);
    const day = padZero(currentDate.getDate());
    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());
    const seconds = padZero(currentDate.getSeconds());

    const localISODate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return localISODate;
  }
}

export default NewProfile;
