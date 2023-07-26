const infoLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'info.log' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = { errorLogger, infoLogger };