// const winston = require('winston');
const path = require('path');
// const { DailyRotateFile } = require('winston-daily-rotate-file');
var winston = require('winston')
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');
// Define el nivel de registro según el entorno
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Crea una instancia de Winston Logger
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      if (stack) {
        log += '\n' + stack;
      }
      return log;
    })
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '5d',
      maxSize: '5m',
      format: winston.format.json()
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '5d',
      maxSize: '5m',
      format: winston.format.json()
    })
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '5d',
      maxSize: '5m',
      format: winston.format.json()
    })
  ],
  exitOnError: false
});

// Agregar transporte de consola para los registros de información
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      handleExceptions: true
    })
  );
}

module.exports = logger;
