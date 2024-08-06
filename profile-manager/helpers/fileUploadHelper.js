import {config} from '../config/config.js';
import ProfileService from "../services/profile.service.js";

class FileUploadHelper{

static uploadFile = async (file, bucketType, fileType, profileNumber) => {
    if (file) {
      const uploadedFile = await ProfileService.uploadFile(
        file,
        config[bucketType],
        fileType,
        profileNumber
      );
      return { [fileType]: uploadedFile };
    }
    return {};
  };
  
static uploadMultipleFiles = async (files, profileNumber) => {
    const uploadedFiles = {};
    
    for (const [fileType, fileInfo] of Object.entries(files)) {
      const { file, bucketType } = fileInfo;
      const result = await this.uploadFile(file, bucketType, fileType, profileNumber);
      Object.assign(uploadedFiles, result);
    }
  
    return uploadedFiles;
  };

  static async handleFileUpload(photoFile, cvFile, coverLetterFile, linkedInPageFile, profileNumber) {
    const filesToUpload = {
      photo: { file: photoFile, bucketType: "publicBucket" },
      cv: { file: cvFile, bucketType: "privateBucket" },
      coverLetter: { file: coverLetterFile, bucketType: "privateBucket" },
      linkedInPage: { file: linkedInPageFile, bucketType: "privateBucket"}
    };
    const uploadedFiles = await this.uploadMultipleFiles(filesToUpload, profileNumber);
    return uploadedFiles;
  };

}

export default FileUploadHelper;