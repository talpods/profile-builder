import openai from "./openAiClient.js";

class OpenAIService {
  static async generate(prompt) {
    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });
      const result = chatCompletion.choices[0].message.content;
      return result;
    } catch (error) {
      return {
        success: false,
        message: "Error generating profile summary",
        error: error,
      };
    }
  }
}

export default OpenAIService;
