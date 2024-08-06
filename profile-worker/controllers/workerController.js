const { generateProfile } = require("../services/openAiService");
const { downloadAndParseDocument } = require("../helpers/fileToText");

exports.generateProfile = async (req, res) => {
  try {
    const result = await generateProfile(req.body.slug);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error in generateProfile:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.fileToText = async (req, res) => {
  try {
    const { url } = req.body;
    const result = await downloadAndParseDocument(url);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error in fileToText:", error.message); // Add this line
    res.status(500).json({ error: error.message });
  }
};
