/**
 * LifeLink - Blood Donation Management System
 * Database Connection & Lifecycle Management
 */

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let isConnected = false;
let retryCount = 0;

/**
 * Connect to MongoDB with retry mechanism
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('Using existing MongoDB connection');
    return mongoose;
  }

  const options = {
    autoIndex: env.isDevelopment,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  };

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, options);
      isConnected = true;
      retryCount = 0;
      logger.info(`MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      retryCount += 1;
      logger.error(`MongoDB connection failed (Attempt ${retryCount}/${MAX_RETRIES}): ${error.message}`);

      if (retryCount < MAX_RETRIES) {
        logger.info(`Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
        return attemptConnection();
      } else {
        logger.error(`Could not connect to MongoDB after ${MAX_RETRIES} attempts. Terminating process.`);
        process.exit(1);
      }
    }
  };

  return attemptConnection();
};

// Event listeners for MongoDB connection state
mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('Mongoose connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('Mongoose connection re-established');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Closing MongoDB connection gracefully...`);
  try {
    await mongoose.connection.close(false);
    logger.info('MongoDB connection closed successfully');
    process.exit(0);
  } catch (err) {
    logger.error(`Error closing MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = connectDB;
module.exports.connectDB = connectDB;
