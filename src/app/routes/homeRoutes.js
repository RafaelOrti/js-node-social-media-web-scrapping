const express = require('express');
const router = express.Router();

const HomeController = require('../controllers/HomeController');

// Ruta para la página de inicio
router.get('/', HomeController.index);

// Ruta para la página "Acerca de"
router.get('/about', HomeController.about);

module.exports = router;
