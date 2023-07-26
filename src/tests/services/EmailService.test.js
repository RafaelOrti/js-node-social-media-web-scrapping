const nodemailer = require('nodemailer');
const EmailService = require('./emailservice');

describe('EmailService', () => {
  // Pruebas para el método 'createTransporter'
  describe('createTransporter', () => {
    it('should create a nodemailer transporter', () => {
      const config = {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password'
        }
      };

      const transporter = EmailService.createTransporter(config);
      expect(transporter).toBeDefined();
      expect(transporter).toBeInstanceOf(nodemailer.Transporter);
    });
  });

  // Pruebas para el método 'sendEmail'
  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password'
        }
      });

      const options = {
        from: 'user@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email.'
      };

      const result = await EmailService.sendEmail(transporter, options);
      expect(result).toBeDefined();
      expect(result.accepted.length).toBe(1);
      expect(result.rejected.length).toBe(0);
    });

    it('should handle errors when sending an email', async () => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password'
        }
      });

      // Invalid 'to' field to trigger an error
      const options = {
        from: 'user@example.com',
        to: 'invalid-email',
        subject: 'Test Email',
        text: 'This is a test email.'
      };

      // Use try-catch block to capture the error
      try {
        await EmailService.sendEmail(transporter, options);
      } catch (error) {
        // You can add more specific assertions here based on the expected error behavior
        expect(error).toBeDefined();
      }
    });
  });
});
