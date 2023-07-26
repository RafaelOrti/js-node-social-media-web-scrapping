const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const logger = require('../utils/logger');

// Cargar las variables de entorno desde el archivo .env
require('dotenv').config({ path: __dirname + '/./../../.env' });

// Función para conectar a la base de datos de MongoDB
const connectToDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('La variable de entorno MONGODB_URI no está configurada. Por favor, asegúrate de configurarla en el archivo .env.');
    }

    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    logger.info('Conexión a la base de datos de MongoDB establecida');
  } catch (error) {
    logger.error('Error al conectar a MongoDB:', error);
    throw new Error('Error en la conexión a la base de datos');
  }
};

// Función para cerrar la conexión a la base de datos de MongoDB
const closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Conexión a la base de datos de MongoDB cerrada');
  } catch (error) {
    logger.error('Error al cerrar la conexión a MongoDB:', error);
    throw new Error('Error al cerrar la conexión a la base de datos');
  }
};

// Exportar las funciones de conexión a la base de datos
module.exports = {
  connectToDatabase,
  closeDatabaseConnection
};

// TO DO: Búsqueda de datos de freemium para saber qué les interesa
// TYPESCRIPT
// O T.DS
