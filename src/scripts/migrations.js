const { connectToDatabase, closeDatabaseConnection } = require('../config/database');
const migrationConfigs = require('../config/migrationConfig');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const createCollectionIfNotExists = async (collectionName) => {
  try {
    const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      await mongoose.connection.db.createCollection(collectionName);
      logger.info(`Colección "${collectionName}" creada con éxito`);
    } else {
      logger.info(`La colección "${collectionName}" ya existe, no se creó.`);
    }
  } catch (error) {
    logger.error(`Error al crear o verificar la colección "${collectionName}": ${error.message}`);
    throw new Error('Error en la creación o verificación de la colección');
  }
};

const dropCollectionIfExists = async (collectionName) => {
  try {
    const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();
    if (collectionExists) {
      await mongoose.connection.db.dropCollection(collectionName);
      logger.info(`Colección "${collectionName}" eliminada con éxito`);
    } else {
      logger.info(`La colección "${collectionName}" no existe, no se eliminó.`);
    }
  } catch (error) {
    logger.error(`Error al eliminar o verificar la colección "${collectionName}": ${error.message}`);
    throw new Error('Error en la eliminación o verificación de la colección');
  }
};

const updateCollectionIfExists = async (collectionName, updateOptions) => {
  try {
    const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();
    if (collectionExists) {
      await mongoose.connection.db.collection(collectionName).updateMany({}, updateOptions);
      logger.info(`Colección "${collectionName}" actualizada con éxito`);
    } else {
      logger.info(`La colección "${collectionName}" no existe, no se actualizó.`);
    }
  } catch (error) {
    logger.error(`Error al actualizar o verificar la colección "${collectionName}": ${error.message}`);
    throw new Error('Error en la actualización o verificación de la colección');
  }
};

const runMigration = async () => {
  const action = process.argv[2]
  try {
    await connectToDatabase();
    
    for (const config of migrationConfigs) {
      const { collectionName, schema, updateOptions } = config;
      console.log(config)
      
      switch (action) {
        case 'up':
          await createCollectionIfNotExists(collectionName, schema);
          break;
        case 'down':
          await dropCollectionIfExists(collectionName);
          break;
        case 'update':
          await updateCollectionIfExists(collectionName, updateOptions);
          break;
        default:
          logger.warn(`La acción de migración "${action}" no es válida para la colección "${collectionName}".`);
          break;
      }
    }

    await closeDatabaseConnection();
  } catch (error) {
    logger.error(`Error al ejecutar las migraciones "${action}": ${error.message}`);
    throw error;
  }
};
runMigration();
module.exports = {
  runMigration
};


//TO DO SACAR TODOS LOS VALORES DE LOS ERRORES EN UN ARCHIVO EXTERIOR O NO?

//Se ha agregado una verificación para obtener el modelo existente en mongoose.models[collectionName] antes de crearlo nuevamente. Esto evita errores y redundancias en la creación del modelo.

// Se ha reemplazado mongoose.model() con mongoose.models[collectionName] para obtener el modelo existente si ya fue creado previamente.

// Se ha utilizado CollectionModel.collection para verificar si la colección existe antes de crearla.

// Se han mantenido las buenas prácticas anteriores, como el manejo adecuado de excepciones, mensajes de registro descriptivos y el uso de funciones async/await.