const express = require('express');
const app = express();

const limiter = require('./src/app/middlewares/rateLimit');
const logger = require('./src/utils/logger');
const authMiddleware = require('./src/app/middlewares/authMiddleware');

const cors = require('cors');
const corsOptions = require('./src/app/middlewares/corsOptions');

const router = require('./src/app/routes');
const database = require('./src/config/database');

// Connect to the database
database.connectToDatabase();

const port = process.env.PORT || 3000;


// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


// // Apply rate limit to all routes
// app.use(limiter);

// Agrega el middleware authMiddleware para verificar la autenticación antes de las rutas
// app.use(authMiddleware);

// Set up routes
app.use(router);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`An error occurred: ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running and listening on port http://localhost:${port}`);
});
