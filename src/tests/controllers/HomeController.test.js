const HomeController = require('../controllers/HomeController');
const User = require('../models/User');
const appInfo = require('../../config/appInfo');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('../models/User'); // Mock the User model

describe('HomeController', () => {
  // Test for index method
  describe('index', () => {
    it('should render the home page with users data', async () => {
      const mockUsers = [{ name: 'John Doe', email: 'john@example.com' }];
      User.find.mockResolvedValue(mockUsers);

      const req = mockRequest();
      const res = mockResponse();

      await HomeController.index(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('home/index', { users: mockUsers });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      User.find.mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();

      await HomeController.index(req, res);

      expect(User.find).toHaveBeenCalledTimes(1);
      expect(res.render).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledWith(error, res);
    });
  });

  // Test for about method
  describe('about', () => {
    it('should render the about page with appInfo data', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await HomeController.about(req, res);

      expect(res.render).toHaveBeenCalledWith('home/about', { appInfo });
    });

    it('should handle errors', async () => {
      const error = new Error('Some error');
      const req = mockRequest();
      const res = mockResponse();

      HomeController.about = jest.fn().mockRejectedValue(error);

      await HomeController.about(req, res);

      expect(res.render).not.toHaveBeenCalled();
      expect(handleError).toHaveBeenCalledWith(error, res);
    });
  });
});
