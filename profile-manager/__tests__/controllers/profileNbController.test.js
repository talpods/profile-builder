import request from 'supertest';
import express from 'express';
import profileNbController from '../../controllers/profileNbController.js';
import profileNbUseCase from '../../usecases/profileNbUseCase.js';

// Create an instance of Express app
const app = express();
app.get('/profile-number', profileNbController.getProfileNumber);

// Mock the profileNbUseCase.createProfileNumber method
jest.mock('../../usecases/profileNbUseCase.js', () => ({
  createProfileNumber: jest.fn(),
}));

describe('profileNbController', () => {
  describe('getProfileNumber', () => {
    it('should return 200 and the profiles on success', async () => {
      // Mock data
      const mockProfiles = [{ id: 1, name: 'Profile 1' }];
      profileNbUseCase.createProfileNumber.mockResolvedValue(mockProfiles);

      const response = await request(app).get('/profile-number');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfiles);
    });

    it('should return 500 and an error message on failure', async () => {
      // Mock error
      const mockError = new Error('Something went wrong');
      profileNbUseCase.createProfileNumber.mockRejectedValue(mockError);

      const response = await request(app).get('/profile-number');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: mockError.message });
    });
  });
});
