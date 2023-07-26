const UserController = require('../controllers/userController');
const User = require('../models/User');

describe('UserController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' },
      ];

      // Mock the database query to return mockUsers
      User.find.mockResolvedValue(mockUsers);

      // Call the getAllUsers function with the mocked request and response objects
      await UserController.getAllUsers(req, res);

      // Verify that the status and json methods were called with the correct values
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database error');

      // Mock the database query to throw an error
      User.find.mockRejectedValue(mockError);

      // Call the getAllUsers function with the mocked request and response objects
      await UserController.getAllUsers(req, res);

      // Verify that the status and json methods were called with the correct values
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getUserById', () => {
    it('should return the user with the given id', async () => {
      const mockUserId = '123456789';
      const mockUser = { name: 'John', email: 'john@example.com' };

      // Mock the database query to return the mockUser
      User.findById.mockResolvedValue(mockUser);

      // Set the req.params.id to the mockUserId
      req.params = { id: mockUserId };

      // Call the getUserById function with the mocked request and response objects
      await UserController.getUserById(req, res);

      // Verify that the status and json methods were called with the correct values
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle error when user is not found', async () => {
      const mockUserId = '123456789';

      // Mock the database query to return null
      User.findById.mockResolvedValue(null);

      // Set the req.params.id to the mockUserId
      req.params = { id: mockUserId };

      // Call the getUserById function with the mocked request and response objects
      await UserController.getUserById(req, res);

      // Verify that the status and json methods were called with the correct values
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      const mockUserId = '123456789';
      const mockError = new Error('Database error');

      // Mock the database query to throw an error
      User.findById.mockRejectedValue(mockError);

      // Set the req.params.id to the mockUserId
      req.params = { id: mockUserId };

      // Call the getUserById function with the mocked request and response objects
      await UserController.getUserById(req, res);

      // Verify that the status and json methods were called with the correct values
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

 // Test for createUser method
  describe('createUser', () => {
    // Test case: should create a new user
    it('should create a new user', async () => {
      const user = { name: 'John', email: 'john@example.com', age: 30, city: 'New York' };
      const createdUser = { ...user, _id: '123456789' };

      req.body = user;
      User.create = jest.fn().mockResolvedValue(createdUser);

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    // Test case: should handle errors
    it('should handle errors', async () => {
      const error = new Error('Database error');

      req.body = { name: 'John', email: 'john@example.com', age: 30, city: 'New York' };
      User.create = jest.fn().mockRejectedValue(error);

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // Test for updateUser method
  describe('updateUser', () => {
    // Test case: should update the user
    it('should update the user', async () => {
      const userId = '123456789';
      const updates = { name: 'John Doe', email: 'johndoe@example.com', age: 35, city: 'Los Angeles' };
      const updatedUser = { _id: userId, ...updates };

      req.params = { id: userId };
      req.body = updates;
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedUser);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    // Test case: should handle user not found
    it('should handle user not found', async () => {
      const userId = '123456789';
      const updates = { name: 'John Doe', email: 'johndoe@example.com', age: 35, city: 'Los Angeles' };

      req.params = { id: userId };
      req.body = updates;
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    // Test case: should handle errors
    it('should handle errors', async () => {
      const error = new Error('Database error');
      const userId = '123456789';
      const updates = { name: 'John Doe', email: 'johndoe@example.com', age: 35, city: 'Los Angeles' };

      req.params = { id: userId };
      req.body = updates;
      User.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // Test for deleteUser method
  describe('deleteUser', () => {
    // Test case: should delete the user
    it('should delete the user', async () => {
      const userId = '123456789';
      const deletedUser = { _id: userId, name: 'John', email: 'john@example.com', age: 30, city: 'New York' };

      req.params = { id: userId };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(deletedUser);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully', user: deletedUser });
    });

    // Test case: should handle user not found
    it('should handle user not found', async () => {
      const userId = '123456789';

      req.params = { id: userId };
      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    // Test case: should handle errors
    it('should handle errors', async () => {
      const error = new Error('Database error');
      const userId = '123456789';

      req.params = { id: userId };
      User.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });


});
