const winston = require('winston');
const { format, transports } = require('winston');
const { combine, timestamp, errors, printf } = format;
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const TelegramBot = require('node-telegram-bot-api');

// Define el nivel de registro según el entorno
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Define el formato del mensaje de registro
const logFormat = printf(({ timestamp, level, message, stack }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (stack) {
    log += '\n' + stack;
  }
  return log;
});

// Configuración del logger
const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(__dirname, 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
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

// Función para agregar un transporte personalizado
function addCustomTransport(options) {
  const { level, filename, datePattern, maxSize, maxFiles } = options;
  logger.add(
    new DailyRotateFile({
      level,
      filename: path.join(__dirname, 'logs', filename),
      datePattern,
      zippedArchive: true,
      maxSize,
      maxFiles
    })
  );
}

// Configuración de transportes personalizados (opcional)
const customTransports = [
  {
    level: 'debug',
    filename: 'debug-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  },
  {
    level: 'info',
    filename: 'info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  }
];

// Agregar transportes personalizados
customTransports.forEach(addCustomTransport);

// Configuración de TelegramBot (opcional)
if (process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_CHAT_ID) {
  const telegramToken = process.env.TELEGRAM_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const bot = new TelegramBot(telegramToken);
  const telegramTransport = new transports.Stream({
    level: 'error',
    stream: {
      write: (log) => {
        bot.sendMessage(telegramChatId, `🚨 ¡Se ha producido un error!\n\n${log}`, { parse_mode: 'Markdown' });
      }
    }
  });
  logger.add(telegramTransport);
}

module.exports = logger;
