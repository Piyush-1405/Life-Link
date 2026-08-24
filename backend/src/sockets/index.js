const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const env = require('../config/env');
const { userRoom, roleRoom, bloodBankRoom, hospitalRoom } = require('./rooms');

// Modular socket event handlers
const registerRequestHandler = require('./handlers/request.handler');
const registerInventoryHandler = require('./handlers/inventory.handler');
const registerDonorHandler = require('./handlers/donor.handler');
const registerNotificationHandler = require('./handlers/notification.handler');

let io = null;

/**
 * Initializes Socket.io server attached to HTTP server
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
function initializeSocket(httpServer) {
  // Determine allowed origins matching Express CORS
  const corsOrigin = env?.CORS_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8081';
  const allowedOrigins = corsOrigin.includes(',')
    ? corsOrigin.split(',').map((origin) => origin.trim())
    : corsOrigin === '*'
    ? '*'
    : [corsOrigin];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT Authentication Middleware for Socket.io connections
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization &&
          socket.handshake.headers.authorization.replace(/^Bearer\s+/i, '')) ||
        socket.handshake.query?.token;

      if (!token) {
        logger.warn(`Socket connection rejected: No auth token provided (Socket ID: ${socket.id})`);
        return next(new Error('Authentication error: Token is required'));
      }

      const secret = env?.JWT_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        logger.error('JWT_SECRET is not defined in environment variables');
        return next(new Error('Server configuration error'));
      }

      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId || decoded.id || decoded._id;

      if (!userId) {
        return next(new Error('Authentication error: Invalid token payload'));
      }

      // Attach authenticated user information to socket object
      socket.user = {
        userId: userId.toString(),
        role: decoded.role || 'PATIENT',
        email: decoded.email,
        bloodBankId: decoded.bloodBankId,
        hospitalId: decoded.hospitalId,
        ...decoded,
      };

      next();
    } catch (error) {
      logger.warn(`Socket authentication failed (Socket ID: ${socket.id}): ${error.message}`);
      return next(new Error(`Authentication error: ${error.message}`));
    }
  });

  // Connection Event
  io.on('connection', (socket) => {
    const userId = socket.user?.userId;
    const role = socket.user?.role;

    logger.info(`Socket connected: [${socket.id}] | User: [${userId}] | Role: [${role}]`);

    // 1. Join user-specific room for direct notifications
    if (userId) {
      const uRoom = userRoom(userId);
      socket.join(uRoom);
      logger.debug(`Socket [${socket.id}] joined user room: ${uRoom}`);
    }

    // 2. Join role-based room for role broadcasts
    if (role) {
      const rRoom = roleRoom(role);
      socket.join(rRoom);
      logger.debug(`Socket [${socket.id}] joined role room: ${rRoom}`);
    }

    // 3. Join institution-specific rooms if affiliated
    if (socket.user?.bloodBankId) {
      const bankRoom = bloodBankRoom(socket.user.bloodBankId);
      socket.join(bankRoom);
      logger.debug(`Socket [${socket.id}] joined blood bank room: ${bankRoom}`);
    }
    if (socket.user?.hospitalId) {
      const hospRoom = hospitalRoom(socket.user.hospitalId);
      socket.join(hospRoom);
      logger.debug(`Socket [${socket.id}] joined hospital room: ${hospRoom}`);
    }

    // Register all socket event handlers
    registerRequestHandler(io, socket);
    registerInventoryHandler(io, socket);
    registerDonorHandler(io, socket);
    registerNotificationHandler(io, socket);

    // Disconnection listener
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: [${socket.id}] | User: [${userId || 'unknown'}] | Reason: [${reason}]`);
    });

    // Error listener
    socket.on('error', (err) => {
      logger.error(`Socket error on [${socket.id}]: ${err.message}`, { error: err });
    });
  });

  logger.info('Socket.io server initialized successfully');
  return io;
}

/**
 * Returns the initialized Socket.io instance
 * @returns {import('socket.io').Server}
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initializeSocket(httpServer) first.');
  }
  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};
