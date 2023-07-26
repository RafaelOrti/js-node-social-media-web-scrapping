const nodemailer = require('nodemailer');
const logger = require('../../../utils/logger');
const handleError = require('../../utils/errorHandler');

const EmailService = {
  createTransporter: (config) => {
    return nodemailer.createTransport(config);
  },

  sendEmail: async (transporter, options) => {
    try {
      return await transporter.sendMail(options);
    } catch (error) {
      handleError(error);
    }
  }
};

module.exports = EmailService;





// const nodemailer = require('nodemailer');

// const EmailService = {
//   async sendEmail(to, subject, body) {
//     try {
//       // Configurar el transporte de correo
//       const transporter = nodemailer.createTransport({
//         // Configuración del servicio de correo saliente (SMTP)
//         service: 'gmail',
//         auth: {
//           user: 'tu_correo@gmail.com',
//           pass: 'tu_contraseña'
//         }
//       });

//       // Configurar el contenido del correo
//       const mailOptions = {
//         from: 'tu_correo@gmail.com',
//         to,
//         subject,
//         html: body
//       };

//       // Enviar el correo electrónico
//       const result = await transporter.sendMail(mailOptions);
//       return result;
//     } catch (error) {
//       logger.error('Error al enviar el correo electrónico:', error);
//       throw error;
//     }
//   }
// };

// module.exports = EmailService;
