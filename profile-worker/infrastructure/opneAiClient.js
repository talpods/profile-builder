require("dotenv").config();
const OpenAI = require("openai");
// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = { openai };
