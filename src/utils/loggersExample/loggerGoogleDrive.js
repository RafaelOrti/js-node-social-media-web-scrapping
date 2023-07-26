const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, splat, json, simple, colorize } = format;
const path = require('path');
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

// Define el nivel de registro según el entorno
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Configuración del logger
const logger = createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), simple()),
      handleExceptions: true
    }),
    new transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    createGoogleDriveTransport()
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, 'logs', 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exitOnError: false
});

// Agregar una función para registrar los mensajes HTTP
logger.http = (message, meta) => {
  logger.info(message, { meta, http: true });
};

// Crear el transporte de Google Drive
function createGoogleDriveTransport() {
  const credentialsPath = '/ruta/hacia/tus/credenciales.json';
  const tokenPath = '/ruta/hacia/tu/token.json';
  const folderId = 'TU_ID_DE_LA_CARPETA_EN_GOOGLE_DRIVE';

  // Cargar las credenciales de Google Drive
  const credentials = JSON.parse(fs.readFileSync(credentialsPath));

  // Configurar el cliente de autenticación
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Obtener el token de acceso
  const token = fs.readFileSync(tokenPath);
  oAuth2Client.setCredentials(JSON.parse(token));

  // Crear el transporte de Google Drive
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = {
    name: 'logger.log',
    parents: [folderId]
  };
  const media = {
    mimeType: 'text/plain',
    body: fs.createReadStream('logs/combined.log')
  };

  return new transports.Stream({
    write: (log) => {
      drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id'
      }, (err, res) => {
        if (err) {
          console.error('Error al guardar el log en Google Drive:', err);
        } else {
          console.log('Log guardado en Google Drive:', res.data.id);
        }
      });
    }
  });
}

module.exports = logger;
