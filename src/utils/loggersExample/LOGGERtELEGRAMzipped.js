const winston = require('winston');
const path = require('path');
const { DailyRotateFile } = require('winston-daily-rotate-file');
const TelegramBot = require('node-telegram-bot-api');

// Define el nivel de registro según el entorno
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Configura el token del bot de Telegram
const telegramToken = 'TU_TOKEN_DEL_BOT_DE_TELEGRAM';

// Crea una instancia del bot de Telegram
const bot = new TelegramBot(telegramToken);

// Configuración del logger
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
    new DailyRotateFile({
      level: 'error',
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.Stream({
      filter: winston.format((info) => info.level === 'error')(),
      stream: {
        write: (log) => {
          // Enviar mensaje de error a Telegram
          bot.sendMessage('TU_CHAT_ID', `🚨 ¡Se ha producido un error!\n\n${log}`, { parse_mode: 'Markdown' });
        }
      }
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
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
