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
    new DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '5d',
      maxSize: '5m',
      format: winston.format.json()
    }),
    new DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '5d',
      maxSize: '5m',
      format: winston.format.json()
    }),
    new winston.transports.Stream({
      stream: {
        write: (log) => {
          const logData = JSON.parse(log);
          if (logData.level === 'error') {
            // Enviar mensaje de error a Telegram
            bot.sendMessage('TU_CHAT_ID', `🚨 ¡Se ha producido un error!\n\n${log}`, { parse_mode: 'Markdown' });
          }
        }
      }
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
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
