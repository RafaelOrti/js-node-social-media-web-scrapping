const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthService = {
  async hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  },

  async comparePasswords(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  },

  generateToken(payload, secretKey, expiresIn) {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  },

  verifyToken(token, secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }
};

module.exports = AuthService;
