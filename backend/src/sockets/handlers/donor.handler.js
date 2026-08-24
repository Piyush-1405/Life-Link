const logger = require('../../utils/logger');
const { requestRoom, userRoom } = require('../rooms');

/**
 * Helper to safely require service or model
 */
function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (error) {
    return null;
  }
}

/**
 * Socket handler for donor interactions (responses, location updates)
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
module.exports = function registerDonorHandler(io, socket) {
  /**
   * Donor accepts or rejects an emergency blood donation request
   * Payload: { requestId, response: 'ACCEPTED'|'REJECTED', eta?: number, notes?: string }
   */
  socket.on('donor.respond', async (data, callback) => {
    try {
      const donorId = socket.user?.userId || socket.user?.id || socket.user?._id;
      const { requestId, response, status, eta, notes } = data || {};

      if (!donorId) {
        logger.warn(`[Socket: ${socket.id}] 'donor.respond' failed: Unauthenticated user`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Authentication required' });
        }
        return;
      }

      if (!requestId || (!response && !status)) {
        logger.warn(`[Socket: ${socket.id}] 'donor.respond' failed: Missing requestId or response`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'requestId and response status are required' });
        }
        return;
      }

      const rawDecision = (response || status).toString().toUpperCase();
      const normalizedStatus = rawDecision.startsWith('ACCEPT') ? 'ACCEPTED' : 'REJECTED';

      logger.info(`Donor [${donorId}] responded [${normalizedStatus}] for request [${requestId}]`);

      let serviceResult = null;
      const donorMatchService = safeRequire('../../services/donorMatch.service');
      if (donorMatchService) {
        try {
          if (typeof donorMatchService.handleDonorResponse === 'function') {
            serviceResult = await donorMatchService.handleDonorResponse({
              donorId,
              requestId,
              status: normalizedStatus,
              eta,
              notes,
            });
          } else if (typeof donorMatchService.respondToRequest === 'function') {
            serviceResult = await donorMatchService.respondToRequest(
              requestId,
              donorId,
              normalizedStatus,
              { eta, notes }
            );
          }
        } catch (serviceErr) {
          logger.warn(`DonorMatch service invocation note: ${serviceErr.message}`);
        }
      }

      // Broadcast donor response to the specific blood request room
      const reqRoom = requestRoom(requestId);
      io.to(reqRoom).emit('donor.response_received', {
        requestId,
        donorId,
        status: normalizedStatus,
        eta: eta || null,
        notes: notes || null,
        timestamp: new Date().toISOString(),
        result: serviceResult || null,
      });

      if (typeof callback === 'function') {
        callback({
          success: true,
          status: normalizedStatus,
          message: `Donation response [${normalizedStatus}] processed successfully`,
          data: serviceResult,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'donor.respond': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error processing donor response' });
      }
    }
  });

  /**
   * Real-time GPS location tracking update from active donor
   * Payload: { latitude, longitude, requestId?: string, accuracy?: number, heading?: number, speed?: number }
   */
  socket.on('location.update', async (data, callback) => {
    try {
      const donorId = socket.user?.userId || socket.user?.id || socket.user?._id;
      const { latitude, longitude, requestId, accuracy, heading, speed } = data || {};

      if (!donorId) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Authentication required' });
        }
        return;
      }

      if (latitude === undefined || longitude === undefined) {
        logger.warn(`[Socket: ${socket.id}] 'location.update' failed: Missing coordinates`);
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'latitude and longitude are required' });
        }
        return;
      }

      const parsedLat = parseFloat(latitude);
      const parsedLng = parseFloat(longitude);

      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        if (typeof callback === 'function') {
          return callback({ success: false, message: 'Invalid coordinate numbers' });
        }
        return;
      }

      const locationPayload = {
        donorId,
        latitude: parsedLat,
        longitude: parsedLng,
        accuracy: accuracy || null,
        heading: heading || null,
        speed: speed || null,
        timestamp: new Date().toISOString(),
      };

      // Update donor location in DB if User or Donor model exists
      const models = safeRequire('../../models');
      const User = models?.User || safeRequire('../../models/User.model');
      if (User && typeof User.findByIdAndUpdate === 'function') {
        try {
          await User.findByIdAndUpdate(donorId, {
            $set: {
              'location.coordinates': [parsedLng, parsedLat],
              'location.updatedAt': new Date(),
            },
          });
        } catch (dbErr) {
          logger.debug(`User location DB update note: ${dbErr.message}`);
        }
      }

      // Broadcast location to active request tracking room if attached to a request
      if (requestId) {
        const reqRoom = requestRoom(requestId);
        socket.to(reqRoom).emit('donor.location_changed', {
          requestId,
          ...locationPayload,
        });
      }

      // Sync across donor's other connected devices
      socket.to(userRoom(donorId)).emit('donor.location_synced', locationPayload);

      if (typeof callback === 'function') {
        callback({
          success: true,
          message: 'Location updated successfully',
          location: locationPayload,
        });
      }
    } catch (error) {
      logger.error(`Error in socket event 'location.update': ${error.message}`, { error });
      if (typeof callback === 'function') {
        callback({ success: false, message: 'Internal server error updating location' });
      }
    }
  });
};
