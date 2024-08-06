import profileNbService from '../../services/profileNbService.js'; 
import profileNbRepository from '../../infrastructure/profileNbRepository.js'; 

jest.mock('../../infrastructure/profileNbRepository.js'); 

describe('profileNbService', () => {
  describe('getProfileNumber', () => {
    it('should return profile numbers on success', async () => {
      profileNbRepository.getProfileNumber.mockResolvedValue([
        { profileNumber: '123' },
        { profileNumber: '456' },
      ]);

      const result = await profileNbService.getProfileNumber();

      expect(result).toEqual([{ profileNumber: '123' }, { profileNumber: '456' }]);
      expect(profileNbRepository.getProfileNumber).toHaveBeenCalled();
    });

    it('should throw an error on failure', async () => {
      profileNbRepository.getProfileNumber.mockRejectedValue(new Error('Repository error'));

      await expect(profileNbService.getProfileNumber()).rejects.toThrow('Repository error');
      expect(profileNbRepository.getProfileNumber).toHaveBeenCalled();
    });
  });
});
