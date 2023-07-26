const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const userRoutes = require('./userRoutes');

// Rutas principales
router.use('/', homeRoutes);
router.use('/users', userRoutes);

//TO DO PONER CARPETA COMPROBAR SI SE HACE ASI PROFESIONAL

module.exports = router;
