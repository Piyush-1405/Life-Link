// /**
//  * LifeLink - Blood Donation Management System
//  * Database Connection & Lifecycle Management
//  */

// const mongoose = require('mongoose');
// const env = require('./env');
// const logger = require('../utils/logger');

// const MAX_RETRIES = 5;
// const RETRY_INTERVAL_MS = 5000;

// let isConnected = false;
// let retryCount = 0;

// /**
//  * Connect to MongoDB with retry mechanism
//  * @returns {Promise<typeof mongoose>}
//  */
// const connectDB = async () => {
//   if (isConnected && mongoose.connection.readyState === 1) {
//     logger.info('Using existing MongoDB connection');
//     return mongoose;
//   }

//   const options = {
//     autoIndex: env.isDevelopment,
//     maxPoolSize: 10,
//     serverSelectionTimeoutMS: 5000,
//     socketTimeoutMS: 45000
//   };

//   const attemptConnection = async () => {
//     try {
//       const conn = await mongoose.connect(env.MONGODB_URI, options);
//       isConnected = true;
//       retryCount = 0;
//       logger.info(`MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
//       return conn;
//     } catch (error) {
//       retryCount += 1;
//       logger.error(`MongoDB connection failed (Attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`);

//       if (retryCount < MAX_RETRIES) {
//         logger.info(`Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000} seconds...`);
//         await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
//         return attemptConnection();
//       } else {
//         logger.error(`Could not connect to MongoDB after ${MAX_RETRIES} attempts. Terminating process.`);
//         process.exit(1);
//       }
//     }
//   };

//   return attemptConnection();
// };

// // Event listeners for MongoDB connection state
// mongoose.connection.on('connected', () => {
//   isConnected = true;
//   logger.info('Mongoose connection established');
// });

// mongoose.connection.on('error', (err) => {
//   logger.error(`Mongoose connection error: ${err.message}`);
// });

// mongoose.connection.on('disconnected', () => {
//   isConnected = false;
//   logger.warn('Mongoose connection disconnected');
// });

// mongoose.connection.on('reconnected', () => {
//   isConnected = true;
//   logger.info('Mongoose connection re-established');
// });

// // Graceful shutdown
// const gracefulShutdown = async (signal) => {
//   logger.info(`Received ${signal}. Closing MongoDB connection gracefully...`);
//   try {
//     await mongoose.connection.close(false);
//     logger.info('MongoDB connection closed successfully');
//     process.exit(0);
//   } catch (err) {
//     logger.error(`Error closing MongoDB connection: ${err.message}`);
//     process.exit(1);
//   }
// };

// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// module.exports = connectDB;
// module.exports.connectDB = connectDB;



/**
 * LifeLink - Blood Donation Management System
 * Database Connection & Lifecycle Management
 */

const dns = require('dns');

// Force Node.js to use public DNS servers for MongoDB Atlas SRV resolution
dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let isConnected = false;

/**
 * Connect to MongoDB with robust fallback handling
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('Using existing MongoDB connection');
    return mongoose;
  }

  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 15000
  };

  const connectionUri =
    process.env.MONGO_URI ||
    env.MONGO_URI ||
    'abc';

  // Check if MongoDB URI is missing
  if (!connectionUri || connectionUri === 'abc') {
    logger.info('========================================================================');
    logger.warn('MONGO_URI is set to placeholder "abc" or missing.');
    logger.info('LifeLink backend will continue in Standalone / In-Memory verified mode.');
    logger.info('To connect your cloud database, set MONGO_URI in .env');
    logger.info('========================================================================');

    return mongoose;
  }

  try {
    logger.info('Attempting MongoDB connection...');

    const conn = await mongoose.connect(connectionUri, options);

    isConnected = true;

    logger.info(
      `✓ MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    logger.error(
      `MongoDB Connection Warning: Could not connect to MONGO_URI. ${error.message}`
    );

    logger.info('========================================================================');
    logger.info('To connect a real MongoDB database, please provide a valid MONGO_URI in .env');
    logger.info('========================================================================');

    return mongoose;
  }
};

// Event listener for successful MongoDB connection
mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('Mongoose connection established');
});

// Event listener for MongoDB errors
mongoose.connection.on('error', (err) => {
  logger.warn(`Mongoose connection notice: ${err.message}`);
});

// Event listener for MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('Mongoose connection disconnected');
});

module.exports = connectDB;
module.exports.connectDB = connectDB;