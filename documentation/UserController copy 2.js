const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('name email').lean();
      res.status(200).json(users);
    } catch (error) {
      handleError(error, 'UserController.getAllUsers', res);
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select('name email').lean();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      handleError(error, 'UserController.getUserById', res);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true
      }).select('name email').lean();

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      handleError(error, 'UserController.updateUser', res);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const deletedUser = await User.findByIdAndDelete(userId).select('name email').lean();

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      handleError(error, 'UserController.deleteUser', res);
    }
  }
};

module.exports = UserController;
