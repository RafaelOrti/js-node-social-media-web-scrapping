const mongoose = require('mongoose');

const userStructure = require('../../src/config/UserStructure');

// Define el esquema de la tabla "users"
const UserSchema = new mongoose.Schema(userStructure);

// Crea la tabla "users" utilizando el esquema definido
const User = mongoose.model('User', UserSchema);

// Exporta la migración
module.exports = {
  up: async () => {
    // Realiza las operaciones para crear la tabla "users"
    await User.createCollection();
  },

  down: async () => {
    // Deshace las operaciones realizadas en "up" para eliminar la tabla "users"
    await User.collection.drop();
  }

  //TO DO, CREAR UPDATE
};
