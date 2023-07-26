// src/services/user/userService.js

const User = require('../../models/User');
const UserDTO = require('../../dtos/User');
const logger = require('../../../utils/logger');
const userValidations = require('../../utils/userValidations');


const userService = {
  getUsers: async () => {
    try {

      const users = await User.find({});
      // const users = await User.find({}).select('name email').lean();
      logger.info('Usuarios leídos: ' + users.length)
      const formattedUsers = users.map(user => UserDTO.format(user));
      logger.info('Usuarios que cumplen formato: ' + formattedUsers.length)
      return formattedUsers;
    } catch (error) {
      throw new Error('Error getting all users');
    }
  },
  getUsersByFilter: async (req) => {
    try {
      const {
        filter,
        sortBy
      } = UserDTO.getFilterAndSort(req);
      const users = await User.find(filter).sort(sortBy).select('name email').lean();
      const formattedUsers = users.map(user => UserDTO.format(user));
      return formattedUsers;
    } catch (error) {
      throw new Error('Error getting users by filter');
    }
  },
  // Fetch all users with pagination support
  getAllUsersByPagination: async (page = 1, pageSize = 10) => {
    try {
      const skip = (page - 1) * pageSize;
      const users = await User.find({}).select('name email').skip(skip).limit(pageSize).lean();
      const formattedUsers = users.map(user => UserDTO.format(user));
      return formattedUsers;
    } catch (error) {
      throw new Error('Failed to get all users');
    }
  },

  // Fetch users based on filtering and sorting criteria with pagination support
  getUsersByFilterByPagination: async (filter = {}, page = 1, pageSize = 10) => {
    try {
      const skip = (page - 1) * pageSize;
      const {
        filter,
        sortBy
      } = UserDTO.getFilterAndSort(req);
      const users = await User.find(filter).sort(sortBy).select('name email').skip(skip).limit(
        pageSize).lean();
      const formattedUsers = users.map(user => UserDTO.format(user));
      return formattedUsers;
    } catch (error) {
      throw new Error('Failed to get users by filter');
    }
  },

  // Suponiendo que ya tienes importado el modelo 'User' y 'UserDTO' para la manipulación de datos y la validación.

  getUserByEmail: async (req) => {
    try {

      const email = userValidations.validateEmail(req.params.email);

      // Buscar el usuario por su correo electrónico y seleccionar solo el nombre y el correo electrónico.
      const user = await User.findOne({ email: email });

      // const user = await User.findOne({ email: userEmail }).select('name email').lean();
      const formattedUser = UserDTO.format(user);

      return formattedUser;
    } catch (error) {
      console.error('Error getting user by email',error);
    }
  },


  getUserById: async (req) => {
    try {
      const userId = userValidations.validateId(req.params.id);
      const user = await User.findById(userId).select('name email').lean();
      if (!user) {
        throw new Error('User not found');
      }
      const formattedUser = UserDTO.format(user);
      return formattedUser;
    } catch (error) {
      throw new Error('Error getting user by ID');
    }
  },

  createUser: async (req) => {
    console.log("entraaa111")
    try {
      const userData = UserDTO.create(req.body);
      // userData.password = await hashPassword(userData.password);
      const newUser = await User.create(userData)
      const formattedUser = UserDTO.format(newUser);
      return formattedUser;
    } catch (error) {
      throw new Error('Error creating user');
    }
  },

  updateUser: async (req) => {
    try {
      const userEmail = userValidations.validateEmail(req.params.email);
      const userData = UserDTO.create(req.body);
      console.log("3333",userData,userEmail)
      const updatedUser = await User.findOneAndUpdate({ email: userEmail }, userData, {
        new: true
      });
      console.log("3333")
      const formattedUser = UserDTO.format(updatedUser);
      return formattedUser;
    } catch (error) {
      throw new Error('Error updating user');
    }
  },

  deleteUser: async (req) => {
    try {
      const userEmail = userValidations.validateEmail(req.params.email);
      const deletedUser = await User.findOneAndRemove(userEmail);
      if (!deletedUser) {
        throw new Error('User not found');
      }
      const formattedUser = UserDTO.format(deletedUser);
      return formattedUser;
    } catch (error) {
      throw new Error('Error deleting user');
    }
  },
};

module.exports = userService;
