// Configuración de la migración
const userSeeder = require('./UserSeeder'); 

const seedersConfigs = [
  {
    collectionName: 'users',// Nombre de la colección en la base de datos
    data: userSeeder// Esquema a utilizar para la colección
  }
];
console.log(userSeeder)
// Exportar la configuración de la migración
module.exports = seedersConfigs;