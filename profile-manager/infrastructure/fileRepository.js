import s3 from "./awsS3.js";
import { config } from "../config/config.js";

class FileRepository {

    static async uploadFile(file, bucket, fileType, profileNumber){
        const fileExtension = file.originalname.split('.').pop();
        const params = {
            Bucket: bucket,
            Key: `${profileNumber}_${fileType}.${fileExtension}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          };
          try {
            const data = await s3.upload(params).promise();
            return data;
          } catch (error) {
            throw { statusCode: 500, message: 'Failed to upload files to S3.', details: error.message };
          }
    }

  static async deleteFile(fileName) {
    const params = {
      Bucket: config.privateBucket,
      Key: fileName,
    };

    try {
      const data = await s3.deleteObject(params).promise();
      return data;
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Failed to delete file from S3.",
        details: error.message,
      };
    }
  }

  static async getSignedUrl(key) {
    const params = {
      Bucket: config.privateBucket,
      Key: key,
      Expires: 60 * 60,
    };
    return s3.getSignedUrlPromise("getObject", params);
  }
}

export default FileRepository;
