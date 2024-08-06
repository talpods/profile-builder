import snsClient from "../infrastructure/snsClient.js";
import { config } from "../config/config.js";

class NotificationService {
  static async sendProfileCreatedNotification(profile) {
    const params = {
      TopicArn: config.snsTopicArn,
      Message: JSON.stringify(profile.slug),
    };

    try {
      await snsClient.publish(params).promise();
      console.log("Profile created notification sent successfully");
    } catch (error) {
      console.error("Error sending profile created notification:", error);
    }
  }
}

export default NotificationService;
