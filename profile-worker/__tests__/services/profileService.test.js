const ProfileService = require('../../services/profileService');
const ProfileRepository = require('../../infrastructure/profileRepository');

// Mock ProfileRepository methods
jest.mock('../../infrastructure/profileRepository');

describe('ProfileService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should return profile if found', async () => {
            const mockProfile = { slug: 'test-slug', name: 'Test Name' };
            ProfileRepository.getProfileBySlug.mockResolvedValue(mockProfile);

            const result = await ProfileService.getProfile('test-slug');

            expect(result).toEqual(mockProfile);
            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('test-slug');
        });

        it('should throw an error if profile not found', async () => {
            ProfileRepository.getProfileBySlug.mockResolvedValue(null);

            await expect(ProfileService.getProfile('test-slug')).rejects.toThrow('Profile not found');
            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('test-slug');
        });

        it('should log and throw an error if there is a repository error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const mockError = new Error('Repository error');
            ProfileRepository.getProfileBySlug.mockRejectedValue(mockError);

            await expect(ProfileService.getProfile('test-slug')).rejects.toThrow('Repository error');
            expect(consoleSpy).toHaveBeenCalledWith('Error getting profile:', 'Repository error');
            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('test-slug');

            consoleSpy.mockRestore();
        });
    });

    describe('updateProfile', () => {
        it('should return updated profile', async () => {
            const mockUpdateData = { name: 'Updated Name' };
            const mockUpdatedProfile = { slug: 'test-slug', ...mockUpdateData };
            ProfileRepository.updateProfile.mockResolvedValue(mockUpdatedProfile);

            const result = await ProfileService.updateProfile('test-slug', mockUpdateData);

            expect(result).toEqual(mockUpdatedProfile);
            expect(ProfileRepository.updateProfile).toHaveBeenCalledWith('test-slug', mockUpdateData);
        });

        it('should log and throw an error if there is a repository error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const mockError = new Error('Repository error');
            ProfileRepository.updateProfile.mockRejectedValue(mockError);

            await expect(ProfileService.updateProfile('test-slug', {})).rejects.toThrow('Repository error');
            expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', 'Repository error');
            expect(ProfileRepository.updateProfile).toHaveBeenCalledWith('test-slug', {});

            consoleSpy.mockRestore();
        });
    });

    describe('updateProfileProperty', () => {
        it('should return result of property update', async () => {
            const mockResult = { success: true };
            ProfileRepository.updateProfileProperty.mockResolvedValue(mockResult);

            const result = await ProfileService.updateProfileProperty('test-slug', 'name', 'New Name');

            expect(result).toEqual(mockResult);
            expect(ProfileRepository.updateProfileProperty).toHaveBeenCalledWith('test-slug', 'name', 'New Name');
        });

        it('should log and throw an error if there is a repository error', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const mockError = new Error('Repository error');
            ProfileRepository.updateProfileProperty.mockRejectedValue(mockError);

            await expect(ProfileService.updateProfileProperty('test-slug', 'name', 'New Name')).rejects.toThrow('Repository error');
            expect(consoleSpy).toHaveBeenCalledWith('Error updating profile property:', 'Repository error');
            expect(ProfileRepository.updateProfileProperty).toHaveBeenCalledWith('test-slug', 'name', 'New Name');

            consoleSpy.mockRestore();
        });
    });
});
