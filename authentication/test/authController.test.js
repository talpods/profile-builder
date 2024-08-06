const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const TokenManager = require('../infrastructure/tokenManager');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth');
const authenticateUser = require('../usecases/authenticateUser');
const tokenService = require('../services/tokenService');

jest.mock('../usecases/authenticateUser');
jest.mock('../services/tokenService');
jest.mock('jsonwebtoken');
jest.mock('../infrastructure/tokenManager');

const app = express();
app.use(express.json());
app.post('/login', authController.login);
app.put('/logout', authController.logout);
app.put('/refresh-token', authController.refreshToken);
app.get('/validate', authenticate, authController.validate);
app.get('/me', authenticate, authController.me);

describe('Auth Controller and Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn() // Ensure json method is defined
    };
    next = jest.fn();

    jest.resetAllMocks();
  });


  describe('Controller: login', () => {
    it('should return tokens for valid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockToken = { accessToken: 'accessToken', refreshToken: 'refreshToken' };
      authenticateUser.mockResolvedValue(mockToken);

      await request(app)
        .post('/login')
        .send(req.body)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.token).toEqual(mockToken);
        });
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongPassword' };
      authenticateUser.mockRejectedValue(new Error('Invalid email or password'));

      await request(app)
        .post('/login')
        .send(req.body)
        .expect(401)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.error).toBe('Invalid email or password');
        });
    });
  });

  describe('Controller: refreshToken', () => {
    it('should return new access token for valid refresh token', async () => {
      req.body = { refreshToken: 'validRefreshToken' };
      const mockTokenData = {
        accessToken: 'oldAccessToken',
        refreshToken: 'validRefreshToken',
        refreshTokenInvalidated: false
      };
      tokenService.getTokenByRefreshToken.mockResolvedValue(mockTokenData);
      jwt.verify.mockImplementation(() => {});
      jwt.decode.mockReturnValue({ payload: { email: 'test@example.com', firstName: 'John', lastName: 'Doe', roles: ['user'], permissions: ['read'] } });
      jwt.sign.mockReturnValue('newAccessToken');

      await request(app)
        .put('/refresh-token')
        .send(req.body)
        .expect(201)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.accessToken).toBe('newAccessToken');
          expect(response.body.refreshToken).toBe('validRefreshToken');
        });
    });

    it('should return 401 for invalid refresh token', async () => {
      req.body = { refreshToken: 'invalidRefreshToken' };
      tokenService.getTokenByRefreshToken.mockResolvedValue({ refreshToken: null, refreshTokenInvalidated: true });

      await request(app)
        .put('/refresh-token')
        .send(req.body)
        .expect(401)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.error).toBe('expired or Invalid refresh token');
        });
    });
  });

  describe('Controller: validate', () => {
    it('should return 401 if user is not authenticated', async () => {
      await request(app)
        .get('/validate')
        .expect(401)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.error).toBe('No token provided');
        });
    });

    it('should return 200 if user is authenticated', async () => {
      req.headers = { authorization: 'Bearer validToken', refreshtoken: 'validRefreshToken' };
      TokenManager.isTokenInvalidated.mockResolvedValue(false);
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { email: 'test@example.com' });
      });

      await request(app)
        .get('/validate')
        .set('Authorization', 'Bearer validToken')
        .set('refreshtoken', 'validRefreshToken')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.message).toBe('valid user');
        });
    });
  });

  describe('Controller: me', () => {
    it('should return 200 with user information', async () => {
      req.headers = { authorization: 'Bearer validToken', refreshtoken: 'validRefreshToken' };
      TokenManager.isTokenInvalidated.mockResolvedValue(false);
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { email: 'test@example.com' });
      });

      await request(app)
        .get('/me')
        .set('Authorization', 'Bearer validToken')
        .set('refreshtoken', 'validRefreshToken')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.user).toEqual({ email: 'test@example.com' });
        });
    });
  });

  describe('Controller: logout', () => {
    it('should return 200 on successful logout', async () => {
      req.body = { refreshToken: 'validRefreshToken' };

      await request(app)
        .put('/logout')
        .send(req.body)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.message).toBe('Logged out successfully');
        });
    });

    it('should return 400 on logout error', async () => {
      req.body = { refreshToken: 'invalidRefreshToken' };
      tokenService.invalidateRefreshToken.mockRejectedValue(new Error('Error logging out'));

      await request(app)
        .put('/logout')
        .send(req.body)
        .expect(400)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.message).toBe('Error logging out');
        });
    });
  });
});
