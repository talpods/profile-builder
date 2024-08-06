const { openai } = require("../../infrastructure/opneAiClient");
const ProfileService = require("../../services/profileService");
const PromptService = require("../../services/promptService");
const { validateResponse } = require("../../helpers/validator");
const { generateProfile } = require("../../services/openAiService");

jest.mock("../../infrastructure/opneAiClient");
jest.mock("../../services/profileService");
jest.mock("../../services/promptService");
jest.mock("../../helpers/validator");

describe("generateProfile", () => {
    const slug = "Test-S";
    const profile = { name: "Test Profile" };
    const prompt = "This is a prompt";
    const validResponse = JSON.stringify({ key: "value" });
    const invalidResponse = "invalid response";

    beforeEach(() => {
        jest.clearAllMocks();
        ProfileService.getProfile.mockResolvedValue(profile);
        PromptService.createProfileGenerationPrompt.mockResolvedValue(prompt);
        ProfileService.updateProfileProperty.mockResolvedValue();
        ProfileService.updateProfile.mockResolvedValue();
    });

    test("should generate a valid profile on the first attempt", async () => {
        openai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: validResponse } }],
        });
        validateResponse.mockReturnValue(true);

        const result = await generateProfile(slug);

        expect(ProfileService.getProfile).toHaveBeenCalledWith(slug);
        expect(PromptService.createProfileGenerationPrompt).toHaveBeenCalledWith(profile);
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "generating");
        expect(openai.chat.completions.create).toHaveBeenCalledWith({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });
        expect(validateResponse).toHaveBeenCalledWith(validResponse);
        expect(ProfileService.updateProfile).toHaveBeenCalledWith(slug, JSON.parse(validResponse));
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "draft");
        expect(result).toBe(validResponse);
    });
    test("should retry and eventually generate a valid profile", async () => {
        openai.chat.completions.create
            .mockResolvedValueOnce({ choices: [{ message: { content: invalidResponse } }] })
            .mockResolvedValueOnce({ choices: [{ message: { content: invalidResponse } }] })
            .mockResolvedValueOnce({ choices: [{ message: { content: validResponse } }] });
        validateResponse.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(true);

        const result = await generateProfile(slug);

        expect(ProfileService.getProfile).toHaveBeenCalledWith(slug);
        expect(PromptService.createProfileGenerationPrompt).toHaveBeenCalledWith(profile);
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "generating");
        expect(openai.chat.completions.create).toHaveBeenCalledTimes(3);
        expect(validateResponse).toHaveBeenCalledTimes(3);
        expect(ProfileService.updateProfile).toHaveBeenCalledWith(slug, JSON.parse(validResponse));
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "draft");
        expect(result).toBe(validResponse);
    });

    test("should handle errors and update the profile status", async () => {
        const errorMessage = "Internal server error";
        openai.chat.completions.create.mockRejectedValue(new Error(errorMessage));
        validateResponse.mockReturnValue(false);

        await expect(generateProfile(slug)).rejects.toThrow(errorMessage);

        expect(ProfileService.getProfile).toHaveBeenCalledWith(slug);
        expect(PromptService.createProfileGenerationPrompt).toHaveBeenCalledWith(profile);
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "generating");
        expect(openai.chat.completions.create).toHaveBeenCalledTimes(3);
        expect(validateResponse).toHaveBeenCalledTimes(0); // No valid responses, so validateResponse isn't called
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "error", `Error on attempt 3:, Error: ${errorMessage}`);
    });

    test("should throw an error if max attempts are reached without a valid response", async () => {
        openai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: invalidResponse } }],
        });
        validateResponse.mockReturnValue(false);

        await expect(generateProfile(slug)).rejects.toThrow(
            `Failed to generate a valid response after 3 attempts`
        );

        expect(ProfileService.getProfile).toHaveBeenCalledWith(slug);
        expect(PromptService.createProfileGenerationPrompt).toHaveBeenCalledWith(profile);
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(slug, "status", "generating");
        expect(openai.chat.completions.create).toHaveBeenCalledTimes(3);
        expect(validateResponse).toHaveBeenCalledTimes(3);
        expect(ProfileService.updateProfileProperty).toHaveBeenCalledWith(
            slug,
            "error",
            `Failed to generate a valid response after 3 attempts`
        );
    });
});
