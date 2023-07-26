const mongoose = require('mongoose');
const { up } = require('../migrations/20230713120000_create_users_table');
const logger = require('../src/utils/logger');

const MONGODB_URI = "mongodb://127.0.0.1:27017/monkey-nets";
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Execute the "up" migration
async function runMigration() {
  try {
    await up();
    logger.info('Migración completada con éxito'); // Log to the combined file
  } catch (error) {
    logger.error('Error en la migración:', error); // Log to the combined file
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Execute the migration function
runMigration();
