const logger = require('../../utils/logger');
const { userRoom } = require('../rooms');

/**
 * Helper to safely require models
 */
function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    return null;
  }
}

/**
 * Socket handler for notification read receipts and synchronization
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
module.exports = function registerNotificationHandler(io, socket) {
  const userId = socket.user?.userId || socket.user?.id || socket.user?._id;

  /**
   * Mark a single notification as read
   * Payload: { notificationId } or string notificationId
   */
  socket.on('notification.read', async (data, callback) => {
    try {
      const notificationId = typeof data === 'string' ? data : data?.notificationId;

      if (!notificationId) {
        logger.warn(`[Socket: ${socket.id}] 'notification.read' failed: Missing notificationId`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'notificationId is required' });
        }
        return;
      }

      const readAt = new Date();
      let updatedNotification = null;

      // Update in database if Notification model is available
      const models = safeRequire('../../models');
      const Notification = models?.Notification || safeRequire('../../models/Notification.model');

      if (Notification && typeof Notification.findOneAndUpdate === 'function') {
        try {
          updatedNotification = await Notification.findOneAndUpdate(
            { _id: notificationId, ...(userId ? { recipient: userId } : {}) },
            { $set: { isRead: true, readAt } },
            { new: true }
          );
        } catch (dbErr) {
          logger.debug(`Notification DB update note: ${dbErr.message}`);
        }
      }

      // Sync across all connected tabs/devices for this user
      if (userId) {
        io.to(userRoom(userId)).emit('notification.marked_read', {
          notificationId,
          readAt: readAt.toISOString(),
        });
      }

      if (typeof callback === 'function') {
        callback({
          success: true,
          notificationId,
          readAt: readAt.toISOString(),
          message: 'Notification marked as read',
          notification: updatedNotification,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'notification.read': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error marking notification as read' });
      }
    }
  });

  /**
   * Mark all unread notifications as read for the authenticated user
   */
  socket.on('notification.read_all', async (data, callback) => {
    try {
      if (!userId) {
        logger.warn(`[Socket: ${socket.id}] 'notification.read_all' failed: Unauthenticated user`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Authentication required' });
        }
        return;
      }

      const readAt = new Date();
      let modifiedCount = 0;

      // Bulk update in DB
      const models = safeRequire('../../models');
      const Notification = models?.Notification || safeRequire('../../models/Notification.model');

      if (Notification && typeof Notification.updateMany === 'function') {
        try {
          const result = await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true, readAt } }
          );
          modifiedCount = result.modifiedCount || 0;
        } catch (dbErr) {
          logger.debug(`Bulk notification DB update note: ${dbErr.message}`);
        }
      }

      // Sync across all connected tabs/devices for this user
      io.to(userRoom(userId)).emit('notification.all_marked_read', {
        userId,
        readAt: readAt.toISOString(),
        count: modifiedCount,
      });

      if (typeof callback === 'function') {
        callback({
          success: true,
          count: modifiedCount,
          readAt: readAt.toISOString(),
          message: 'All notifications marked as read',
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'notification.read_all': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error marking all notifications as read' });
      }
    }
  });
};
