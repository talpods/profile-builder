const PromptService = require('../../services/promptService');
const { fetchAndParseFileFromS3 } = require("../../infrastructure/profileRepository");

// Mock the fetchAndParseFileFromS3 function
jest.mock("../../infrastructure/profileRepository", () => ({
    fetchAndParseFileFromS3: jest.fn(),
}));

describe('PromptService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('createProfileGenerationPrompt', () => {
        it('should generate a prompt with all provided information', async () => {
            // Mock the fetchAndParseFileFromS3 function to return sample content
            fetchAndParseFileFromS3
                .mockResolvedValueOnce('Sample CV content')
                .mockResolvedValueOnce('Sample cover letter content')
                .mockResolvedValueOnce('Sample LinkedIn profile content');

            const profileInformation = {
                coverLetterUrl: 'http://example.com/coverletter',
                cvUrl: 'http://example.com/cv',
                linkedInProfile: 'http://example.com/linkedin',
            };

            const result = await PromptService.createProfileGenerationPrompt(profileInformation);

            // Check if the function was called with the correct arguments
            expect(fetchAndParseFileFromS3).toHaveBeenCalledTimes(3);
            expect(fetchAndParseFileFromS3).toHaveBeenCalledWith('http://example.com/cv');
            expect(fetchAndParseFileFromS3).toHaveBeenCalledWith('http://example.com/coverletter');
            expect(fetchAndParseFileFromS3).toHaveBeenCalledWith('http://example.com/linkedin');

            // Check if the result contains the expected content
            expect(result).toContain('Sample CV content');
            expect(result).toContain('Sample cover letter content');
            expect(result).toContain('Sample LinkedIn profile content');
            expect(result).toContain('You are a professional profile builder and recruiter');
        });

        it('should handle missing cover letter', async () => {
            fetchAndParseFileFromS3
                .mockResolvedValueOnce('Sample CV content')
                .mockResolvedValueOnce('Sample LinkedIn profile content');

            const profileInformation = {
                coverLetterUrl: '',
                cvUrl: 'http://example.com/cv',
                linkedInProfile: 'http://example.com/linkedin',
            };

            const result = await PromptService.createProfileGenerationPrompt(profileInformation);

            expect(fetchAndParseFileFromS3).toHaveBeenCalledTimes(2);
            expect(fetchAndParseFileFromS3).not.toHaveBeenCalledWith('');
            expect(result).toContain('Sample CV content');
            expect(result).toContain('Sample LinkedIn profile content');
            expect(result).not.toContain('Sample cover letter content');
        });

        it('should handle missing LinkedIn profile', async () => {
            fetchAndParseFileFromS3
                .mockResolvedValueOnce('Sample CV content')
                .mockResolvedValueOnce('Sample cover letter content');

            const profileInformation = {
                coverLetterUrl: 'http://example.com/coverletter',
                cvUrl: 'http://example.com/cv',
                linkedInProfile: '',
            };

            const result = await PromptService.createProfileGenerationPrompt(profileInformation);

            expect(fetchAndParseFileFromS3).toHaveBeenCalledTimes(2);
            expect(fetchAndParseFileFromS3).not.toHaveBeenCalledWith('');
            expect(result).toContain('Sample CV content');
            expect(result).toContain('Sample cover letter content');
            expect(result).not.toContain('Sample LinkedIn profile content');
        });
        it('should include JSON properties in the prompt', async () => {
            fetchAndParseFileFromS3.mockResolvedValueOnce('Sample CV content');
          
            const profileInformation = {
              coverLetterUrl: '',
              cvUrl: 'http://example.com/cv',
              linkedInProfile: '',
            };
          
            const result = await PromptService.createProfileGenerationPrompt(profileInformation);
          
            expect(result).toContain('specialization: { type: String }');
            expect(result).toContain('yearsExperience: { type: Number }');
            expect(result).toContain('domainExperience: { type: Array, items: String }');
            // Add more checks for other JSON properties as needed
          });
    });
});