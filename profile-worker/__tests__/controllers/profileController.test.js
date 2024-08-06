const request = require('supertest');
const express = require('express');
const profileController = require('../../controllers/profileController');   
const ProfileService = require('../../services/profileService');

jest.mock('../../services/profileService');

const app = express();
app.use(express.json());
app.put('/profile/:slug', profileController.updateProfile);
app.get('/profile/:slug', profileController.getProfile);

describe('Profile Controller', () => {
    let consoleSpy;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    describe('updateProfile', () => {
        it('should update a profile and return the updated profile', async () => {
            const mockProfile = { name: 'Test User', age: 30 };
            ProfileService.updateProfile.mockResolvedValue(mockProfile);

            const response = await request(app)
                .put('/profile/test-slug')
                .send({ name: 'Test User', age: 30 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockProfile);
            expect(ProfileService.updateProfile).toHaveBeenCalledWith('test-slug', {
                name: 'Test User',
                age: 30,
            });
        });

        it('should return 404 if profile not found', async () => {
            ProfileService.updateProfile.mockRejectedValue(
                new Error('Profile not found')
            );

            const response = await request(app)
                .put('/profile/test-slug')
                .send({ name: 'Test User', age: 30 });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Profile not found' });
        });

        it('should return 500 if there is a server error', async () => {
            ProfileService.updateProfile.mockRejectedValue(
                new Error('Internal server error')
            );

            const response = await request(app)
                .put('/profile/test-slug')
                .send({ name: 'Test User', age: 30 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('getProfile', () => {
        it('should get a profile and return it', async () => {
            const mockProfile = { name: 'Test User', age: 30 };
            ProfileService.getProfile.mockResolvedValue(mockProfile);

            const response = await request(app).get('/profile/test-slug');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockProfile);
            expect(ProfileService.getProfile).toHaveBeenCalledWith('test-slug');
        });

        it('should return 404 if profile not found', async () => {
            ProfileService.getProfile.mockRejectedValue(
                new Error('Profile not found')
            );

            const response = await request(app).get('/profile/test-slug');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Profile not found' });
        });

        it('should return 500 if there is a server error', async () => {
            ProfileService.getProfile.mockRejectedValue(
                new Error('Internal server error')
            );

            const response = await request(app).get('/profile/test-slug');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });
    });
});
