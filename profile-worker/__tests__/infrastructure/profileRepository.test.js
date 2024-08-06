const AWS = require('aws-sdk');
const ProfileRepository = require('../../infrastructure/profileRepository');
require('dotenv').config();

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        get: jest.fn(),
        update: jest.fn(),
    };
    const mS3 = {
        getObject: jest.fn(),
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocumentClient),
        },
        S3: jest.fn(() => mS3),
        config: {
            update: jest.fn(),
        },
    };
});

describe('ProfileRepository', () => {
    const mockProfile = {
        slug: 'test-slug',
        name: 'Test Profile',
        // Add other profile fields as necessary
    };

    const mockUpdatedProfile = {
        ...mockProfile,
        name: 'Updated Test Profile',
    };

    const mockUpdatedAttributes = { keyStrengths: 'Strong communication' };

    let documentClient;
    let s3;

    beforeAll(() => {
        AWS.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        documentClient = new AWS.DynamoDB.DocumentClient();
        s3 = new AWS.S3();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfileBySlug', () => {
        it('should retrieve a profile by slug', async () => {
            documentClient.get.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Item: mockProfile }),
            });

            const result = await ProfileRepository.getProfileBySlug('test-slug');
            expect(result).toEqual(mockProfile);
        });

        it('should handle errors during profile retrieval', async () => {
            documentClient.get.mockReturnValueOnce({
                promise: jest.fn().mockRejectedValue(new Error('Error retrieving profile')),
            });

            await expect(ProfileRepository.getProfileBySlug('test-slug')).rejects.toThrow('Error retrieving profile');
        });
    });

    describe('updateProfile', () => {
        it('should update a profile', async () => {
            documentClient.update.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Attributes: mockUpdatedProfile }),
            });

            const result = await ProfileRepository.updateProfile('test-slug', mockUpdatedProfile);
            expect(result).toEqual({ success: true, message: 'Profile updated successfully', data: mockUpdatedProfile });
        });

        it('should handle errors during profile update', async () => {
            documentClient.update.mockReturnValueOnce({
                promise: jest.fn().mockRejectedValue(new Error('Error updating profile')),
            });

            const result = await ProfileRepository.updateProfile('test-slug', mockUpdatedProfile);
            expect(result).toEqual({ success: false, message: 'Error updating profile', error: expect.any(Error) });
        });
    });

    describe('updateProfileProperty', () => {
        it('should update a profile property', async () => {
            documentClient.update.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Attributes: mockUpdatedAttributes }),
            });

            const result = await ProfileRepository.updateProfileProperty('test-slug', 'keyStrengths', 'Strong communication');
            expect(result).toEqual({ success: true, message: 'Profile property updated successfully', data: mockUpdatedAttributes });
        });

        it('should handle errors during profile property update', async () => {
            documentClient.update.mockReturnValueOnce({
                promise: jest.fn().mockRejectedValue(new Error('Error updating profile property')),
            });

            const result = await ProfileRepository.updateProfileProperty('test-slug', 'keyStrengths', 'Strong communication');
            expect(result).toEqual({ success: false, message: 'Error updating profile property', error: expect.any(Error) });
        });
    });

    describe('fetchAndParseFileFromS3', () => {
        it('should fetch and parse a file from S3', async () => {
            const parsedDocumentContent = 'Parsed document content';
            s3.getObject.mockReturnValueOnce({
                promise: jest.fn().mockResolvedValue({ Body: Buffer.from(parsedDocumentContent) }),
            });
            
            const pdf = require('pdf-parse');
            pdf.mockResolvedValueOnce({ text: parsedDocumentContent });  // Mock pdf response
    
            const result = await ProfileRepository.fetchAndParseFileFromS3('test-file.pdf');
            expect(result).toBe(parsedDocumentContent);
            expect(s3.getObject).toHaveBeenCalled();
        });
    
        it('should handle errors during file fetch or parse from S3', async () => {
            const errorMessage = 'The specified key does not exist.';
            s3.getObject.mockReturnValueOnce({
                promise: jest.fn().mockRejectedValue(new Error(errorMessage)),
            });
    
            await expect(ProfileRepository.fetchAndParseFileFromS3('nonexistent-file.pdf')).rejects.toThrow(errorMessage);
        });
    });
    
});
