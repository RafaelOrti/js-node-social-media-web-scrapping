const { body, validationResult } = require('express-validator');

const validationHelper = {
  validateUserUpdate: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name should not exceed 50 characters'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email'),

    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password should be at least 6 characters long')
  ],

  handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  }
};

module.exports = validationHelper;