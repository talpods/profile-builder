import slugService from '../../services/slugService.js';
import slugRepository from '../../infrastructure/slugRepository.js';

// Mock the slugRepository
jest.mock('../../infrastructure/slugRepository.js');

describe('slugService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfilesBySlug', () => {
    it('should return profiles by slug from repository', async () => {
      const mockData = [
        { firstName: 'John', lastName: 'Doe', slug: 'john-d' },
        { firstName: 'Jane', lastName: 'Smith', slug: 'jane-s' },
      ];
      slugRepository.getProfilesBySlug.mockResolvedValue(mockData);

      const result = await slugService.getProfilesBySlug('John', 'Doe');

      expect(result).toEqual(mockData);
      expect(slugRepository.getProfilesBySlug).toHaveBeenCalledWith('John', 'Doe');
    });

    it('should handle empty result from repository', async () => {
      slugRepository.getProfilesBySlug.mockResolvedValue([]);

      const result = await slugService.getProfilesBySlug('John', 'Doe');

      expect(result).toEqual([]);
      expect(slugRepository.getProfilesBySlug).toHaveBeenCalledWith('John', 'Doe');
    });

    it('should throw error when repository throws error', async () => {
      const mockError = new Error('Database error');
      slugRepository.getProfilesBySlug.mockRejectedValue(mockError);

      await expect(slugService.getProfilesBySlug('John', 'Doe')).rejects.toThrow(mockError);
      expect(slugRepository.getProfilesBySlug).toHaveBeenCalledWith('John', 'Doe');
    });
  });
});
