const logger = require('../../utils/logger');
const { requestRoom } = require('../rooms');

/**
 * Socket handler for blood request real-time rooms
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
module.exports = function registerRequestHandler(io, socket) {
  /**
   * User joins a specific request tracking room
   * Payload: { requestId } or string requestId
   */
  socket.on('request.join', (data, callback) => {
    try {
      const requestId = typeof data === 'string' ? data : data?.requestId;

      if (!requestId) {
        logger.warn(`[Socket: ${socket.id}] 'request.join' failed: Missing requestId`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'requestId is required' });
        }
        return;
      }

      const room = requestRoom(requestId);
      socket.join(room);
      logger.info(`Socket [${socket.id}] User [${socket.user?.userId || 'anonymous'}] joined room [${room}]`);

      if (typeof callback === 'function') {
        callback({
          success: true,
          room,
          message: `Successfully joined request room ${room}`,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'request.join': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error while joining request room' });
      }
    }
  });

  /**
   * User leaves a specific request tracking room
   * Payload: { requestId } or string requestId
   */
  socket.on('request.leave', (data, callback) => {
    try {
      const requestId = typeof data === 'string' ? data : data?.requestId;

      if (!requestId) {
        logger.warn(`[Socket: ${socket.id}] 'request.leave' failed: Missing requestId`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'requestId is required' });
        }
        return;
      }

      const room = requestRoom(requestId);
      socket.leave(room);
      logger.info(`Socket [${socket.id}] User [${socket.user?.userId || 'anonymous'}] left room [${room}]`);

      if (typeof callback === 'function') {
        callback({
          success: true,
          room,
          message: `Successfully left request room ${room}`,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'request.leave': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error while leaving request room' });
      }
    }
  });
};
