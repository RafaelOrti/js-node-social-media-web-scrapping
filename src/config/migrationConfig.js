
const userStructure = require('./UserStructure'); 
// Configuración de la migración
const migrationConfigs = [
  {
    collectionName: 'users',// Nombre de la colección en la base de datos
    schema: userStructure// Esquema a utilizar para la colección
  }
];

// Exportar la configuración de la migración
module.exports = migrationConfigs;