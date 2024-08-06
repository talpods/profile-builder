import express from 'express';
import request from 'supertest';
import profileNbRouter from '../../routes/profileNb.js';
import profileNbUseCase from '../../usecases/profileNbUseCase.js';

jest.mock('../../usecases/profileNbUseCase.js');

const app = express();
app.use('/profiles', profileNbRouter);

describe('profileNbRouter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profiles', () => {
    it('should return profile numbers on success', async () => {
      const mockProfiles = [{ profileNumber: '123' }, { profileNumber: '456' }];
      profileNbUseCase.createProfileNumber.mockResolvedValue(mockProfiles);

      const response = await request(app).get('/profiles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfiles);
    });

    it('should return 500 on failure', async () => {
      profileNbUseCase.createProfileNumber.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app).get('/profiles');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });
});
