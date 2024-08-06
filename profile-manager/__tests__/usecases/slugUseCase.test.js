import slugUsecase from '../../usecases/slugUsecase.js';
import slugService from '../../services/slugService.js';
import createSlug from '../../helpers/createSlug.js';

// Mock the slugService and createSlug
jest.mock('../../services/slugService.js');
jest.mock('../../helpers/createSlug.js');

describe('slugUsecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('slugHandler', () => {
    it('should return a new slug if no existing slugs are found', async () => {
      slugService.getProfilesBySlug.mockResolvedValue([]);
      createSlug.mockReturnValue('john-d');

      const result = await slugUsecase.slugHandler('John', 'Doe');

      expect(result).toBe('john-d');
      expect(createSlug).toHaveBeenCalledWith('John', 'Doe');
    });

    it('should return the next slug incremented by 1 if existing slugs are found', async () => {
      const mockData = [
        { slug: 'john-d1' },
        { slug: 'john-d2' },
        { slug: 'john-d3' },
      ];
      slugService.getProfilesBySlug.mockResolvedValue(mockData);

      const result = await slugUsecase.slugHandler('John', 'Doe');

      expect(result).toBe('john-d4');
    });

    it('should handle unsorted slugs and return the correct next slug', async () => {
      const mockData = [
        { slug: 'john-d2' },
        { slug: 'john-d1' },
        { slug: 'john-d3' },
      ];
      slugService.getProfilesBySlug.mockResolvedValue(mockData);

      const result = await slugUsecase.slugHandler('John', 'Doe');

      expect(result).toBe('john-d4');
    });

    it('should return a slug with "1" appended if no numeric suffix is found', async () => {
      const mockData = [
        { slug: 'john-d' },
        { slug: 'john-d' },
      ];
      slugService.getProfilesBySlug.mockResolvedValue(mockData);

      const result = await slugUsecase.slugHandler('John', 'Doe');

      expect(result).toBe('john-d1');
    });

    it('should increment the numeric suffix correctly when a mix of slugs are present', async () => {
      const mockData = [
        { slug: 'john-d' },
        { slug: 'john-d1' },
        { slug: 'john-d2' },
      ];
      slugService.getProfilesBySlug.mockResolvedValue(mockData);

      const result = await slugUsecase.slugHandler('John', 'Doe');

      expect(result).toBe('john-d3');
    });
  });
});
