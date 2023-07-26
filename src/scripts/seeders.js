const mongoose = require('mongoose');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database');
const logger = require('../utils/logger');
const seedersConfigs = require('../config/seedersConfig');
const DatabasePetitions = require('../app/services/dataAcces/dataAccess');
// Cargar las variables de entorno desde el archivo .env


const createIfNotExists = async (element, collectionName) => {
  const email = element.email;
  try {
    const existing = await DatabasePetitions.findByEmail(email, collectionName);

    if (!existing) {
      await DatabasePetitions.create(element, collectionName);
      logger.info(`Usuario con el correo electrónico ${email} creado exitosamente`);
    } else {
      logger.info(`El usuario con el correo electrónico ${email} ya existe en la base de datos. No se creó un nuevo usuario.`);
    }
  } catch (error) {
    logger.error(`Error al crear el usuario: ${error}`);
  }
};

const dropIfExists = async (element, collectionName) => {
  const email = element.email;
  try {
    const existing = await DatabasePetitions.findByEmail(email, collectionName);

    if (existing) {
      await DatabasePetitions.deleteByEmail(email, collectionName);
      logger.info(`Usuario con el correo electrónico ${email} eliminado exitosamente`);
    } else {
      logger.info(`El usuario con el correo electrónico ${email} no existe en la base de datos. No se eliminó ningún usuario.`);
    }
  } catch (error) {
    logger.error(`Error al eliminar el usuario: ${error}`);
  }
};

const updateIfExists = async (element, collectionName) => {
  const email = element.email;
  try {
    const existing = await DatabasePetitions.findByEmail(email, collectionName);

    if (existing) {
      await DatabasePetitions.updateByEmail(email, element, collectionName);
      logger.info(`Usuario con el correo electrónico ${email} actualizado exitosamente`);
    } else {
      await DatabasePetitions.create(element, collectionName);
      logger.info(`El usuario con el correo electrónico ${email} no existía en la base de datos. Se ha creado.`);
    }
  } catch (error) {
    logger.error(`Error al actualizar el usuario: ${error}`);
  }
};

const runSeeders = async () => {
  const action = process.argv[2]
  try {
    await connectToDatabase();

    for (const config of seedersConfigs) {
      console.log(config)
      switch (action) {
        case 'up':
          await Promise.all(config.data.map((element) => createIfNotExists(element, config.collectionName)));
          break;
        case 'down':
          await Promise.all(config.data.map((element) => dropIfExists(element, config.collectionName)));
          break;
        case 'update':
          await Promise.all(config.data.map((element) => updateIfExists(element, config.collectionName)));
          break;
        default:
          logger.warn(`La acción de seeder "${action}" no es válida para la colección "${config.collectionName}".`);
          break;
      }
    }

    await closeDatabaseConnection();
  } catch (error) {
    logger.error(`Error al ejecutar las migraciones "${action}": ${error.message}`);
    throw error;
  }
};
runSeeders();
module.exports = {
  runSeeders,
};


// const runSeeders = async (action) => {
//   try {
//     await connectToDatabase();

//     for (const config of seedersConfigs) {
//       switch (action) {
//         case 'up':
//           for (const element of config.data) {
//             await createUserIfNotExists(element, config.collectionName);
//           }
//           break;
//         case 'down':
//           for (const element of config.data) {
//             await dropUserIfExists(element, config.collectionName);
//           }
//           break;
//         case 'update':
//           for (const element of config.data) {
//             await updateUserIfExists(element, config.collectionName);
//           }
//           break;
//         default:
//           logger.warn(
//             `La acción de seeder "${action}" no es válida para la colección "${config.collectionName}".`
//           );
//           break;
//       }
//     }

//     await closeDatabaseConnection();
//   } catch (error) {
//     logger.error(`Error al ejecutar las migraciones "${action}": ${error.message}`);
//     throw error;
//   }
// };