const { connectToDatabase, closeDatabaseConnection } = require('../src/config/database');
const migrationConfigs = require('../config/migrationConfig');
const logger = require('../src/utils/logger');
const mongoose = require('mongoose');

const MIGRATION_ACTION_UP = 'up';
const MIGRATION_ACTION_DOWN = 'down';
const MIGRATION_ACTION_UPDATE = 'update';

const COLLECTION_ACTIONS = {
  [MIGRATION_ACTION_UP]: {
    action: createCollection,
    message: 'Colección creada con éxito',
    errorMessage: 'Error al crear la colección'
  },
  [MIGRATION_ACTION_DOWN]: {
    action: dropCollection,
    message: 'Colección eliminada con éxito',
    errorMessage: 'Error al eliminar la colección'
  },
  [MIGRATION_ACTION_UPDATE]: {
    action: updateCollection,
    message: 'Colección actualizada con éxito',
    errorMessage: 'Error al actualizar la colección'
  }
};

// Función para crear una colección
async function createCollection(collectionName, schema) {
  try {
    const CollectionSchema = new mongoose.Schema(schema);
    const CollectionModel = mongoose.model(collectionName, CollectionSchema);

    await CollectionModel.createCollection();
    logger.info(`Colección "${collectionName}" creada con éxito`);
  } catch (error) {
    logger.error(`Error al crear la colección "${collectionName}":`, error);
    throw new Error('Error en la creación de la colección');
  }
}

// Función para eliminar una colección
async function dropCollection(collectionName) {
  try {
    await mongoose.connection.db.dropCollection(collectionName);
    logger.info(`Colección "${collectionName}" eliminada con éxito`);
  } catch (error) {
    logger.error(`Error al eliminar la colección "${collectionName}":`, error);
    throw new Error('Error en la eliminación de la colección');
  }
}

// Función para actualizar una colección
async function updateCollection(collectionName, updateOptions) {
  try {
    await mongoose.connection.db.collection(collectionName).updateMany({}, updateOptions);
    logger.info(`Colección "${collectionName}" actualizada con éxito`);
  } catch (error) {
    logger.error(`Error al actualizar la colección "${collectionName}":`, error);
    throw new Error('Error en la actualización de la colección');
  }
}

// Función para ejecutar una migración
async function runMigration(actionFunc, collectionName, action) {
  try {
    logger.info(`Iniciando migración "${collectionName}" - "${action}"...`);
    await actionFunc();
    logger.info(`Migración "${collectionName}" - "${action}" completada con éxito.`);
  } catch (error) {
    logger.error(`Error en la ejecución de la migración "${collectionName}" - "${action}":`, error);
    throw error;
  }
}

// Función para ejecutar todas las migraciones para una acción específica
async function runAllMigrations(action) {
  try {
    await connectToDatabase();
    for (const config of migrationConfigs) {
      const { collectionName } = config;
      const collectionAction = COLLECTION_ACTIONS[action];

      if (collectionAction) {
        await runMigration(collectionAction.action.bind(null, collectionName, config.schema), collectionName, action);
      } else {
        logger.warn(`La acción de migración "${action}" no es válida para la colección "${collectionName}".`);
      }
    }
    await closeDatabaseConnection();
  } catch (error) {
    logger.error(`Error al ejecutar las migraciones "${action}":`, error);
    throw error;
  }
}

module.exports = {
  up: async () => runAllMigrations(MIGRATION_ACTION_UP),
  down: async () => runAllMigrations(MIGRATION_ACTION_DOWN),
  update: async () => runAllMigrations(MIGRATION_ACTION_UPDATE)
};
