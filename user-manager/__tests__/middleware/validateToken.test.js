const validateToken = require('../../middleware/validateToken');
const axios = require('axios');

jest.mock('axios');

describe('validateToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer valid_token',
        refreshtoken: 'valid_refresh_token'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if token is valid', async () => {
    axios.get.mockResolvedValue({
      status: 200,
      data: { id: 'user123' }
    });

    await validateToken(req, res, next);

    expect(req.user).toEqual({ id: 'user123' });
    expect(next).toHaveBeenCalled();
  });

  it('should respond with 401 if token is invalid', async () => {
    axios.get.mockRejectedValue({
      response: { status: 401 }
    });

    await validateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is not valid or not provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond with 500 for other errors', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await validateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error validating token: Network Error' });
    expect(next).not.toHaveBeenCalled();
  });
});
