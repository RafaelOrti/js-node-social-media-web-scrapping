
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

const { validateUserUpdate, handleValidationErrors } = require('../helpers/validationHelper');

const authenticateUser = require('../middlewares/authMiddleware');


// Ruta para obtener todos los usuarios
router.get('/', UserController.getAllUsers);

// Ruta para obtener un usuario por su ID
// router.get('/:id', UserController.getUserById);

// Ruta para obtener un usuario por su ID
router.get('/:email', UserController.getUserByEmail);

// Ruta para crear un nuevo usuario
// router.post('/', authenticateUser, UserController.createUser);
router.post('/', UserController.createUser);

// Ruta para actualizar un usuario
// router.put('/:id', authenticateUser, validateUserUpdate, handleValidationErrors, UserController.updateUser);
router.put('/:email', UserController.updateUser);

// Ruta para eliminar un usuario
// router.delete('/:id', authenticateUser, UserController.deleteUser);
router.delete('/:email',UserController.deleteUser);

module.exports = router;
