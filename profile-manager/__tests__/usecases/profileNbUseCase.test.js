import profileNbUsecase from '../../usecases/profileNbUseCase.js';
import profileNbService from '../../services/profileNbService.js';

// Mock the profileNbService
jest.mock('../../services/profileNbService.js');

describe('profileNbUsecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfileNumber', () => {
    it('should return 1 if no profile numbers are found', async () => {
      profileNbService.getProfileNumber.mockResolvedValue([]);

      const result = await profileNbUsecase.createProfileNumber();

      expect(result).toBe(1);
    });

    it('should return the next profile number incremented by 1', async () => {
      const mockData = [
        { profileNumber: '1' },
        { profileNumber: '2' },
        { profileNumber: '3' },
      ];
      profileNbService.getProfileNumber.mockResolvedValue(mockData);

      const result = await profileNbUsecase.createProfileNumber();

      expect(result).toBe(4);
    });

    it('should handle unsorted profile numbers and return the correct next number', async () => {
      const mockData = [
        { profileNumber: '3' },
        { profileNumber: '1' },
        { profileNumber: '2' },
      ];
      profileNbService.getProfileNumber.mockResolvedValue(mockData);

      const result = await profileNbUsecase.createProfileNumber();

      expect(result).toBe(4);
    });

  });
});
