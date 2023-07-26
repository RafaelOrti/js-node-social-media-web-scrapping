const winston = require('winston');

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = errorLogger;