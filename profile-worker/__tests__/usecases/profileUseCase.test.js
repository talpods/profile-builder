const ProfileUseCase = require('../../usecases/ProfileUseCase');
const ProfileRepository = require('../../infrastructure/profileRepository.js');

// Mock the ProfileRepository
jest.mock('../../infrastructure/profileRepository.js');

describe('ProfileUseCase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should return a profile when it exists', async () => {
            const mockProfile = { id: '1', name: 'John Doe' };
            ProfileRepository.getProfileBySlug.mockResolvedValue(mockProfile);

            const result = await ProfileUseCase.getProfile('john-doe');

            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('john-doe');
            expect(result).toEqual(mockProfile);
        });

        it('should throw an error when profile is not found', async () => {
            ProfileRepository.getProfileBySlug.mockResolvedValue(null);

            await expect(ProfileUseCase.getProfile('non-existent')).rejects.toThrow('Profile not found');
            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('non-existent');
        });

        it('should throw an error when repository throws an error', async () => {
            const error = new Error('Database error');
            ProfileRepository.getProfileBySlug.mockRejectedValue(error);

            await expect(ProfileUseCase.getProfile('john-doe')).rejects.toThrow('Database error');
            expect(ProfileRepository.getProfileBySlug).toHaveBeenCalledWith('john-doe');
        });
    });

    describe('updateProfile', () => {
        it('should return updated profile on successful update', async () => {
            const updateData = { name: 'John Updated' };
            const updatedProfile = { id: '1', name: 'John Updated' };
            ProfileRepository.updateProfile.mockResolvedValue(updatedProfile);

            const result = await ProfileUseCase.updateProfile('john-doe', updateData);

            expect(ProfileRepository.updateProfile).toHaveBeenCalledWith('john-doe', updateData);
            expect(result).toEqual(updatedProfile);
        });

        it('should throw an error when repository throws an error', async () => {
            const updateData = { name: 'John Updated' };
            const error = new Error('Update failed');
            ProfileRepository.updateProfile.mockRejectedValue(error);

            await expect(ProfileUseCase.updateProfile('john-doe', updateData)).rejects.toThrow('Update failed');
            expect(ProfileRepository.updateProfile).toHaveBeenCalledWith('john-doe', updateData);
        });
    });
});