const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthService = require('./authservice');

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const password = 'password123';
      const hashedPassword = await AuthService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });
  });

  describe('comparePasswords', () => {
    it('should return true when comparing correct passwords', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isMatch = await AuthService.comparePasswords(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing incorrect passwords', async () => {
      const password = 'password123';
      const incorrectPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isMatch = await AuthService.comparePasswords(incorrectPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: '123456789' };
      const secretKey = 'your_secret_key';
      const expiresIn = '1h';

      const token = AuthService.generateToken(payload, secretKey, expiresIn);
      const decoded = jwt.verify(token, secretKey);

      expect(decoded.userId).toBe(payload.userId);
    });
  });

  describe('verifyToken', () => {
    it('should return the decoded payload when the token is valid', () => {
      const payload = { userId: '123456789' };
      const secretKey = 'your_secret_key';
      const expiresIn = '1h';

      const token = jwt.sign(payload, secretKey, { expiresIn });
      const decoded = AuthService.verifyToken(token, secretKey);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload.userId);
    });

    it('should return null when the token is invalid or expired', () => {
      const payload = { userId: '123456789' };
      const secretKey = 'your_secret_key';
      const expiresIn = '1s';

      const token = jwt.sign(payload, secretKey, { expiresIn });

      // Wait for 2 seconds to make the token invalid
      setTimeout(() => {
        const decoded = AuthService.verifyToken(token, secretKey);
        expect(decoded).toBeNull();
      }, 2000);
    });
  });
});
