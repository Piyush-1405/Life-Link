/**
 * LifeLink - Blood Donation & Emergency Management Backend
 * Main Express Application Entry Point
 */

// 1. Load environment configuration
const env = require('./config/env');

// 2. Core dependencies
const express = require('express');
const http = require('http');
const cors = require('./config/cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 3. Sanitization
const mongoSanitize = require('express-mongo-sanitize');

// 4. Database Connection
const connectDB = require('./config/db');

// 5. Rate Limiting
const { generalLimiter } = require('./config/rateLimit');

// 6. Application Routes
const routes = require('./routes/index');

// 7. Error Handling Middleware
const errorHandler = require('./middleware/errorHandler.middleware');

// 8. Real-time WebSockets
const { initializeSocket } = require('./sockets/index');

// 9. Scheduled Background Jobs
const { startScheduler } = require('./jobs/scheduler');

// 10. Centralized Logger
const logger = require('./utils/logger');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Apply Security & Utility Middlewares
app.use(helmet());

// CORS configuration (handles both pre-configured middleware or options object)
if (typeof cors === 'function') {
  app.use(cors);
} else {
  const corsMiddleware = require('cors');
  app.use(corsMiddleware(cors));
}

// HTTP request logger
app.use(morgan('dev'));

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// General API rate limiting
if (generalLimiter) {
  app.use(generalLimiter);
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'LifeLink API',
  });
});

// Mount Application Routes
app.use('/api', routes);

// 404 Route Handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware (Must be applied LAST)
app.use(errorHandler);

// Initialize Socket.io on the HTTP server
initializeSocket(server);

// Server startup function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP and WebSocket server
    const PORT = env?.PORT || process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.info('================================================');
      logger.info(`LifeLink Backend running in [${env?.NODE_ENV || process.env.NODE_ENV || 'development'}] mode`);
      logger.info(`Server listening on port: ${PORT}`);
      logger.info(`Health check available at: http://localhost:${PORT}/api/health`);
      logger.info('================================================');
    });

    // Start scheduled background jobs
    startScheduler();
  } catch (error) {
    logger.error('Failed to start LifeLink server:', error);
    process.exit(1);
  }
};

// Process-wide error and termination event listeners
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Rejection at:', { promise, reason });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing HTTP server gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

startServer();

module.exports = { app, server };
