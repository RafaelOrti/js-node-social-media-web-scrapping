// const logger = require('../../utils/logger');

// const handleError = (error, res) => {
//   const errorMessage = (typeof error === 'object' && error.message) ? error.message : error.toString();
//   logger.error(errorMessage);

//   if (res) {
//     let status = error.status || 500;
    
//     if (status >= 400 && status < 500) {
//     return res.status(status).json({ error: errorMessage });
//     }
//     return res.status(status).render('server-error', { error: errorMessage });
//   }

//   throw new Error(errorMessage);
// };

// module.exports = handleError;

// handleError(error, res);


const logger = require('../../utils/logger');

const handleError = (error) => {
  const errorMessage = (typeof error === 'object' && error.message) ? error.message : error.toString();
  logger.error(errorMessage);

  let status = error.status || 500;

  if (status >= 400 && status < 500) {
    return { error: errorMessage, status };
  }

  return { error: errorMessage, status, render: true };
};

module.exports = handleError;


