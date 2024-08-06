const { openai } = require("../infrastructure/opneAiClient");
const ProfileService = require("./profileService");
const PromptService = require("./promptService");

const { validateResponse } = require("../helpers/validator");

exports.generateProfile = async (slug) => {
  const maxAttempts = 3;
  let attempt = 0;
  let result;
  let isValid = false;

  const profile = await ProfileService.getProfile(slug);

  while (attempt < maxAttempts && !isValid) {
    attempt++;
    try {
      const prompt = await PromptService.createProfileGenerationPrompt(profile);
      await ProfileService.updateProfileProperty(slug, "status", "generating");
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });
      const chatResponse = chatCompletion.choices[0].message.content;
      result = cleanJsonString(chatResponse);
      isValid = validateResponse(`${result}`);

      if (isValid) {
        console.log(`Valid response generated on attempt ${attempt}`);
        const update = await ProfileService.updateProfile(
          slug,
          JSON.parse(result)
        );
        await ProfileService.updateProfileProperty(slug, "status", "draft");
        return result;
      } else {
        console.log(`Invalid response on attempt ${attempt}, retrying...`);
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      await ProfileService.updateProfileProperty(
        slug,
        "error",
        `Error on attempt ${attempt}:, ${error}`
      );
      await ProfileService.updateProfileProperty(slug, "status", "error");

      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }

  if (!isValid) {
    await ProfileService.updateProfileProperty(
      slug,
      "error",
      `Failed to generate a valid response after ${maxAttempts} attempts`
    );
    await ProfileService.updateProfileProperty(slug, "status", "error");

    throw new Error(
      `Failed to generate a valid response after ${maxAttempts} attempts`
    );
  }
};

function cleanJsonString(jsonString) {
  let cleaned = jsonString.replace(/^\s*```json\s*/, "");
  cleaned = cleaned.replace(/\s*```\s*$/, "");
  return cleaned.trim();
}
