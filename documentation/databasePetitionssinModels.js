const mongoose = require('mongoose');

const DatabasePetitions = {
  findByEmail: async (email, collectionName) => {
    return mongoose.connection.db.collection(collectionName).findOne({ email });
  },

  create: async (user, collectionName) => {
    return mongoose.connection.db.collection(collectionName).insertOne(user);
  },

  deleteByEmail: async (email, collectionName) => {
    return mongoose.connection.db.collection(collectionName).deleteOne({ email });
  },

  updateByEmail: async (email, data, collectionName) => {
    return mongoose.connection.db.collection(collectionName).updateOne({ email }, data);
  },

  findAll: async (collectionName) => {
    return mongoose.connection.db.collection(collectionName).find({}).toArray();
  },

  findById: async (id, collectionName) => {
    return mongoose.connection.db.collection(collectionName).findOne({ _id: id });
  },

  updateById: async (id, data, collectionName) => {
    return mongoose.connection.db.collection(collectionName).updateOne({ _id: id }, data);
  },

  deleteById: async (id, collectionName) => {
    return mongoose.connection.db.collection(collectionName).deleteOne({ _id: id });
  },

  findAndUpdate: async (query, data, collectionName) => {
    return mongoose.connection.db.collection(collectionName).updateOne(query, data);
  },

  count: async (collectionName) => {
    return mongoose.connection.db.collection(collectionName).countDocuments();
  },

  findAllByFilter: async (filter, collectionName) => {
    return mongoose.connection.db.collection(collectionName).find(filter).toArray();
  },

  findAndSort: async (filter, sortBy, collectionName) =>  {
      return mongoose.connection.db.collection(collectionName).find(filter).sort(sortBy).toArray();
  },
};

module.exports = DatabasePetitions;



// const findUserByEmail = async (email, collectionName) => {
//   try {
//     return await mongoose.connection.db.collection(collectionName).findOne({ email });
//   } catch (error) {
//     logger.error('Error finding user by email:', error);
//     throw error;
//   }
// };

// const createUser = async (user, collectionName) => {
//   try {
//     return await mongoose.connection.db.collection(collectionName).insertOne(user);
//   } catch (error) {
//     logger.error('Error creating user:', error);
//     throw error;
//   }
// };

// const deleteUserByEmail = async (email, collectionName) => {
//   try {
//     return await mongoose.connection.db.collection(collectionName).deleteOne({ email });
//   } catch (error) {
//     logger.error('Error deleting user by email:', error);
//     throw error;
//   }
// };

// const updateUserByEmail = async (email, data, collectionName) => {
//   try {
//     return await mongoose.connection.db.collection(collectionName).updateOne({ email }, data);
//   } catch (error) {
//     logger.error('Error updating user by email:', error);
//     throw error;
//   }
// };