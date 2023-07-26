const { connectToDatabase, closeDatabaseConnection } = require('../config/database');
const migrationConfigs = require('../config/migrationConfig');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Función para crear una colección
const createCollection = async (collectionName, schema) => {
  try {
    const CollectionSchema = new mongoose.Schema(schema);
    const CollectionModel = mongoose.model(collectionName, CollectionSchema);

    await CollectionModel.createCollection();
    logger.info(`Colección "${collectionName}" creada con éxito`);
  } catch (error) {
    logger.error(`Error al crear la colección "${collectionName}":`, error);
    throw new Error('Error en la creación de la colección');
  }
};

// Función para eliminar una colección
const dropCollection = async (collectionName) => {
  try {
    await mongoose.connection.db.dropCollection(collectionName);
    logger.info(`Colección "${collectionName}" eliminada con éxito`);
  } catch (error) {
    logger.error(`Error al eliminar la colección "${collectionName}":`, error);
    throw new Error('Error en la eliminación de la colección');
  }
};

// Función para actualizar una colección
const updateCollection = async (collectionName, updateOptions) => {
  try {
    await mongoose.connection.db.collection(collectionName).updateMany({}, updateOptions);
    logger.info(`Colección "${collectionName}" actualizada con éxito`);
  } catch (error) {
    logger.error(`Error al actualizar la colección "${collectionName}":`, error);
    throw new Error('Error en la actualización de la colección');
  }
};

const runMigration = async (migrationFunc, collectionName, action) => {
  try {
    logger.info(`Iniciando migración "${collectionName}" - "${action}"...`);
    await connectToDatabase();
    await migrationFunc();
    await closeDatabaseConnection();
    logger.info(`Migración "${collectionName}" - "${action}" completada con éxito. Conexión a la base de datos cerrada.`);
  } catch (error) {
    logger.error(`Error en la ejecución de la migración "${collectionName}" - "${action}":`, error);
    throw error;
  }
};

module.exports = {
  up: () => {
    try {
      migrationConfigs.forEach(async (config) => {
        await runMigration(createCollection.bind(null, config.collectionName, config.schema), config.collectionName, 'up');
      });
    } catch (error) {
      logger.error('Error al ejecutar las migraciones "up":', error);
      throw error;
    }
  },

  down: () => {
    try {
      migrationConfigs.forEach(async (config) => {
        await runMigration(dropCollection.bind(null, config.collectionName), config.collectionName, 'down');
      });
    } catch (error) {
      logger.error('Error al ejecutar las migraciones "down":', error);
      throw error;
    }
  },

  update: () => {
    try {
      migrationConfigs.forEach(async (config) => {
        await runMigration(updateCollection.bind(null, config.collectionName, updateOptions), config.collectionName, 'update');
      });
    } catch (error) {
      logger.error('Error al ejecutar las migraciones "update":', error);
      throw error;
    }
  }
};

