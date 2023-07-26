const User = require('../models/User');
const logger = require('../../utils/logger');
const handleError = require('../utils/errorHandler');

const HomeController = {
  index: async (req, res) => {
    try {
      const users = await User.find().select('name email').lean();
      res.render('home/index', {
        users
      });
    } catch (error) {
      handleError(error, res);
    }
  },

  about: async (req, res) => {
    try {
      res.render('home/about', {
        appInfo
      });
    } catch (error) {
      handleError(error, res);
    }
  }
};

module.exports = HomeController;


// const User = require('../models/User');
// const logger = require('../utils/logger');
// const handleError = require('./handleError');

// const HomeController = {
//   index: async (req, res) => {
//     try {
//       const users = await User.find().select('name email').lean();
//       res.render('home/index', {
//         users
//       });
//     } catch (error) {
//       handleError('index', error, res);
//     }
//   },

//   about: async (req, res) => {
//     try {
//       const appInfo = {
//         version: '1.0.0',
//         author: 'John Doe',
//         description: 'Example web application'
//       };

//       res.render('home/about', {
//         appInfo
//       });
//     } catch (error) {
//       handleError('about', error, res);
//     }
//   }
// };

// const handleError = (methodName, error, res) => {
//   const errorMessage = `An error occurred in HomeController ${methodName}: ${error}`;
//   logger.error(errorMessage);
//   res.status(500).render('error', {
//     error: 'Internal Server Error'
//   });
// };

// module.exports = HomeController;
