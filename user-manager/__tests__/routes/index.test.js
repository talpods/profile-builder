const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/index'); 
const userController = require('../../controllers/userController');
const validateToken = require('../../middleware/validateToken');

const app = express();
app.use(express.json());
app.use(userRoutes);

jest.mock('../../controllers/userController');
jest.mock('../../middleware/validateToken');

describe('User Routes', () => {
  beforeEach(() => {
    validateToken.mockClear();
    userController.createUser.mockClear();
    userController.getAllUsers.mockClear();
    userController.getUserByEmail.mockClear();
    userController.deleteUser.mockClear();
    userController.updateUser.mockClear();
    userController.updatePassword.mockClear();
  });

  it('should call createUser on POST /users', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.createUser.mockImplementation((req, res) => res.status(201).send({ message: 'User created' }));

    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(validateToken).toHaveBeenCalled();
    expect(userController.createUser).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
  });

  it('should call getAllUsers on GET /users', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.getAllUsers.mockImplementation((req, res) => res.status(200).send([{ email: 'test@example.com' }]));

    const response = await request(app).get('/users');

    expect(validateToken).toHaveBeenCalled();
    expect(userController.getAllUsers).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ email: 'test@example.com' }]);
  });

  it('should call getUserByEmail on GET /users/:email', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.getUserByEmail.mockImplementation((req, res) => res.status(200).send({ email: 'test@example.com' }));

    const response = await request(app).get('/users/test@example.com');

    expect(validateToken).toHaveBeenCalled();
    expect(userController.getUserByEmail).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });

  it('should call deleteUser on DELETE /users', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.deleteUser.mockImplementation((req, res) => res.status(200).send({ message: 'User deleted' }));

    const response = await request(app).delete('/users');

    expect(validateToken).toHaveBeenCalled();
    expect(userController.deleteUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });

  it('should call updateUser on PUT /users', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.updateUser.mockImplementation((req, res) => res.status(200).send({ message: 'User updated' }));

    const response = await request(app)
      .put('/users')
      .send({ email: 'test@example.com', newPassword: 'newPassword123' });

    expect(validateToken).toHaveBeenCalled();
    expect(userController.updateUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated');
  });

  it('should call updatePassword on POST /users/update-password', async () => {
    validateToken.mockImplementation((req, res, next) => next());
    userController.updatePassword.mockImplementation((req, res) => res.status(200).send({ message: 'Password updated' }));

    const response = await request(app)
      .post('/users/update-password')
      .send({ email: 'test@example.com', oldPassword: 'password123', newPassword: 'newPassword123' });

    expect(validateToken).toHaveBeenCalled();
    expect(userController.updatePassword).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password updated');
  });
});
