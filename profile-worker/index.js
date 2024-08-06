const express = require("express");
const router = require("./routes/index");
const config = require("./config/config");
const { generateProfile } = require("./services/openAiService");
require("dotenv").config();

exports.handler = async (event) => {
  try {
    // Process each record from the SQS event
    for (const record of event.Records) {
      const snsMessage = JSON.parse(record.body);

      // Extract the necessary information from the SQS message
      const slug = JSON.parse(snsMessage.Message);

      // Call generateProfile function
      await generateProfile(slug);

      console.log(`Profile generation initiated for slug: ${slug}`);
    }

    return { statusCode: 200, body: "Profile generation complete" };
  } catch (error) {
    console.error("Error processing SNS message:", error);
    return { statusCode: 500, body: "Error processing SQS message" };
  }
};
