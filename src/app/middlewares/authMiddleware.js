const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../.env');
const logger = require('../../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }

    setDecodedTokenInRequest(req, decoded);
    next();
  } catch (error) {
    handleAuthError(error, res);
  }
};

const getTokenFromRequest = (req) => {
  return req.header('Authorization') || null;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const setDecodedTokenInRequest = (req, decoded) => {
  req.user = decoded;
};

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

const handleAuthError = (error, res) => {
  const errorMessage = `Error in authMiddleware: ${error.message}`;
  logger.error(errorMessage);
  return sendErrorResponse(res, 401, 'Unauthorized');
};

module.exports = authMiddleware;

