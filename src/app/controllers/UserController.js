const handleError = require('../utils/errorHandler');
const userService = require('../services/dataAcces/userService');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      
      const users = await userService.getUsers();
      
      res.status(200).json(users);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  getAllUsersByFilter: async (req, res) => {
    try {
      const users = await userService.getUsersByFilter(req);
      res.status(200).json(users);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const user = await userService.getUserByEmail(req);
      res.status(200).json(user);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(req);
      res.status(200).json(user);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await userService.createUser(req);
      res.status(201).json(user);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  updateUser: async (req, res) => {
    console.log("2222")
    try {
      const user = await userService.updateUser(req);
      res.status(200).json(user);
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await userService.deleteUser(req);
      res.status(200).json({
        message: 'User deleted successfully',
        user: user
      });
    } catch (error) {
      const result = handleError(error);
      if (result.render) {
        res.status(result.status).render('error', {
          errorMessage: result.error
        });
      } else {
        res.status(result.status).json({
          error: result.error
        });
      }
    }
  }
};

module.exports = UserController;
