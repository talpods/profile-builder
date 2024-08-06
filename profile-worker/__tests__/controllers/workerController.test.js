const request = require("supertest");
const express = require("express");
const workerController = require("../../controllers/workerController");
const { generateProfile } = require("../../services/openAiService");
const { downloadAndParseDocument } = require("../../helpers/fileToText");

jest.mock("../../services/openAiService");
jest.mock("../../helpers/fileToText");

const app = express();
app.use(express.json());
app.post("/generateProfile", workerController.generateProfile);
app.post("/fileToText", workerController.fileToText);

describe("Worker Controller", () => {
  describe("generateProfile", () => {
    it("should generate a profile and return the result", async () => {
      const mockResult = { profile: "Generated Profile" };
      generateProfile.mockResolvedValue(mockResult);

      const response = await request(app)
        .post("/generateProfile")
        .send({ slug: "sample-slug" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(generateProfile).toHaveBeenCalledWith("sample-slug");
    });

    it("should return 500 if there is a server error", async () => {
      generateProfile.mockRejectedValue(new Error("Internal server error"));

      const response = await request(app)
        .post("/generateProfile")
        .send({ slug: "sample-slug" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("fileToText", () => {
    it("should convert file to text and return the result", async () => {
      const mockResult = { text: "Parsed text from document" };
      downloadAndParseDocument.mockResolvedValue(mockResult);

      const response = await request(app)
        .post("/fileToText")
        .send({ url: "http://example.com/document.pdf" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(downloadAndParseDocument).toHaveBeenCalledWith(
        "http://example.com/document.pdf"
      );
    });

    it("should return 500 if there is a server error", async () => {
      downloadAndParseDocument.mockRejectedValue(
        new Error("Internal server error")
      );

      const response = await request(app)
        .post("/fileToText")
        .send({ url: "http://example.com/document.pdf" });

      console.log("fileToText error response:", response.body);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });
});
