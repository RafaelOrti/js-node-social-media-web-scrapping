// utils/passwordUtils.js

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = (password) => {
  console.log("111111111111111111")
  console.log("www", password)
  try {
    const hashedPassword = bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password',error);
  }
};

module.exports = {
  hashPassword,
};
