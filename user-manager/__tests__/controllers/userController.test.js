const userManagementRepo = require("../../infrastructure/userManagmentRepo");
const userController = require("../../controllers/userController"); // Adjust the path according to your project structure

jest.mock("../../infrastructure/userManagmentRepo");

describe('User Controller', () => {
  
  describe('createUser', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          acl: { roles: ['user'] },
          createdAt: new Date()
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 400 if any required field is missing', async () => {
      req.body.email = '';
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'All fields are required' });
    });

    it('should return 401 if user already exists', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User with this email already exists' });
    });

    it('should return 201 if user is created successfully', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      userManagementRepo.createUser.mockResolvedValue({ success: true });
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User created successfully' });
    });

    it('should return 500 if there is an error while creating user', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      userManagementRepo.createUser.mockResolvedValue({ success: false, message: 'Error', error: 'Some error' });
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error', error: 'Some error' });
    });

    it('should return 501 if there is an internal server error', async () => {
      const error = new Error('Internal error');
      userManagementRepo.getUserByEmail.mockRejectedValue(error);
      await userController.createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error', error: error.message });
    });
  });

  describe('getAllUsers', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        render: jest.fn()
      };
    });

    it('should return 200 and list of users if users are found', async () => {
      userManagementRepo.getAllUsers.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);
      await userController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith([{ id: 1, email: 'test@example.com' }]);
    });

    it('should render error if no users are found', async () => {
      userManagementRepo.getAllUsers.mockResolvedValue(null);
      await userController.getAllUsers(req, res);
      expect(res.render).toHaveBeenCalledWith('error', { message: 'There is no users to show' });
    });

    it('should return 500 if there is an error while fetching users', async () => {
      const error = new Error('Fetching error');
      userManagementRepo.getAllUsers.mockRejectedValue(error);
      await userController.getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(error.message);
    });
  });

  describe('deleteUser', () => {
    let req, res;

    beforeEach(() => {
      req = { body: { email: 'test@example.com' } };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
    });

    it('should return 400 if email is not provided', async () => {
      req.body.email = '';
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Email is required' });
    });

    it('should return 404 if user is not found', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 200 if user is deleted successfully', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      userManagementRepo.deleteUser.mockResolvedValue();
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 500 if there is an error while deleting user', async () => {
      const error = new Error('Deleting error');
      userManagementRepo.getUserByEmail.mockRejectedValue(error);
      await userController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateUser', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          acl: { roles: ['user'] }
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 400 if any required field is missing', async () => {
      req.body.email = '';
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'All fields are required' });
    });

    it('should return 404 if user is not found', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should return 200 if user is updated successfully', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      userManagementRepo.updateUser.mockResolvedValue({ success: true });
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'User updated successfully' });
    });

    it('should return 500 if there is an error while updating user', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      userManagementRepo.updateUser.mockResolvedValue({ success: false, message: 'Error', error: 'Some error' });
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error', error: 'Some error' });
    });

    it('should return 501 if there is an internal server error', async () => {
      const error = new Error('Internal error');
      userManagementRepo.getUserByEmail.mockRejectedValue(error);
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error', error: error.message });
    });
  });

  describe('getUserByEmail', () => {
    let req, res;

    beforeEach(() => {
      req = { params: { email: 'test@example.com' } };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 400 if email is not provided', async () => {
      req.params.email = '';
      await userController.getUserByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email is required' });
    });

    it('should return 404 if user is not found', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      await userController.getUserByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should return 200 if user is found', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });
      await userController.getUserByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1, email: 'test@example.com' } });
    });

    it('should return 501 if there is an internal server error', async () => {
      const error = new Error('Internal error');
      userManagementRepo.getUserByEmail.mockRejectedValue(error);
      await userController.getUserByEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error', error: error.message });
    });
  });

  describe('updatePassword', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          newPassword: 'newPassword123'
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 400 if email or newPassword is not provided', async () => {
      req.body.email = '';
      await userController.updatePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email and newPassword are required' });
    });

    it('should return 404 if user is not found', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(null);
      await userController.updatePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User not found' });
    });

    it('should return 200 if password is updated successfully', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      userManagementRepo.updatePassword.mockResolvedValue({ success: true });
      await userController.updatePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password updated successfully' });
    });

    it('should return 500 if there is an error while updating password', async () => {
      userManagementRepo.getUserByEmail.mockResolvedValue(true);
      userManagementRepo.updatePassword.mockResolvedValue({ success: false, error: 'Update error' });
      await userController.updatePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error updating password', error: 'Update error' });
    });

    it('should return 500 if there is an internal server error', async () => {
      const error = new Error('Internal error');
      userManagementRepo.getUserByEmail.mockRejectedValue(error);
      await userController.updatePassword(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error', error: error.message });
    });
  });
});
