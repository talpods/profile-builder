import slugController from '../../controllers/slugController.js';
import slugUsecase from '../../usecases/slugUsecase.js';

// Mocking the usecase module
jest.mock('../../usecases/slugUsecase.js', () => ({
  slugHandler: jest.fn(),
}));

describe('slugController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Mock Express request and response objects
    mockReq = {
      params: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return profiles when slugHandler succeeds', async () => {
    // Mock successful response from slugUsecase.slugHandler
    const mockProfiles = [{ name: 'Profile 1' }, { name: 'Profile 2' }];
    slugUsecase.slugHandler.mockResolvedValue(mockProfiles);

    // Call the controller method
    await slugController.getProfilesBySlug(mockReq, mockRes);

    // Verify response status and JSON data sent
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockProfiles);

    // Verify slugUsecase.slugHandler was called with correct parameters
    expect(slugUsecase.slugHandler).toHaveBeenCalledWith('John', 'Doe');
  });

  it('should return 500 status and error message when slugHandler throws an error', async () => {
    // Mock error response from slugUsecase.slugHandler
    const mockError = new Error('Test error');
    slugUsecase.slugHandler.mockRejectedValue(mockError);

    // Call the controller method
    await slugController.getProfilesBySlug(mockReq, mockRes);

    // Verify response status and JSON error message sent
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: mockError.message });

    // Verify slugUsecase.slugHandler was called with correct parameters
    expect(slugUsecase.slugHandler).toHaveBeenCalledWith('John', 'Doe');
  });
});
