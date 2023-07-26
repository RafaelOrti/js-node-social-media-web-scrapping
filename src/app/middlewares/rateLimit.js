const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // Max requests per window
  message: 'Too many requests. Please try again later.'
});
module.exports = limiter;