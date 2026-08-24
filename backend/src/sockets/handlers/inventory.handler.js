const logger = require('../../utils/logger');
const { bloodBankRoom } = require('../rooms');

/**
 * Socket handler for inventory updates and blood bank rooms
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
module.exports = function registerInventoryHandler(io, socket) {
  /**
   * Blood bank user joins their designated blood bank room for inventory notifications
   * Payload: { bloodBankId } or { bankId } or string bloodBankId
   */
  socket.on('inventory.join_bank', (data, callback) => {
    try {
      const bankId =
        typeof data === 'string'
          ? data
          : data?.bloodBankId || data?.bankId || socket.user?.bloodBankId;

      if (!bankId) {
        logger.warn(`[Socket: ${socket.id}] 'inventory.join_bank' failed: Missing bloodBankId`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'bloodBankId is required' });
        }
        return;
      }

      // Check role authorization (allow BLOOD_BANK, ADMIN, HOSPITAL, or matching bankId)
      const userRole = socket.user?.role?.toUpperCase();
      if (userRole && !['BLOOD_BANK', 'ADMIN', 'HOSPITAL'].includes(userRole)) {
        logger.warn(
          `Unauthorized inventory room join attempt: User [${socket.user?.userId}] with role [${userRole}] for bank [${bankId}]`
        );
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Unauthorized to join blood bank inventory room' });
        }
        return;
      }

      const room = bloodBankRoom(bankId);
      socket.join(room);
      logger.info(`Socket [${socket.id}] User [${socket.user?.userId || 'anonymous'}] joined blood bank room [${room}]`);

      if (typeof callback === 'function') {
        callback({
          success: true,
          room,
          message: `Successfully joined blood bank room ${room}`,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'inventory.join_bank': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error while joining blood bank room' });
      }
    }
  });
};
