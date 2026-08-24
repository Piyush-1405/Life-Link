const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { getIO } = require('../sockets/index');
const { bloodBankRoom, requestRoom, roleRoom } = require('../sockets/rooms');

/**
 * Safely resolves a Mongoose model
 */
function resolveModel(modelName, filePath) {
  try {
    if (mongoose.models[modelName]) {
      return mongoose.models[modelName];
    }
    const models = require('../models');
    if (models && models[modelName]) {
      return models[modelName];
    }
    return require(filePath);
  } catch (error) {
    try {
      return mongoose.model(modelName);
    } catch (e) {
      return null;
    }
  }
}

/**
 * Scheduled job to check and timeout active reservations that exceeded their confirmation window.
 * - Queries Reservation where status='ACTIVE' and expiresAt < now
 * - Sets reservation status to 'EXPIRED'
 * - Reverts corresponding inventory units back to 'AVAILABLE'
 * - Logs the count of released reservations and units
 * - Emits real-time socket events to affected parties
 */
async function checkReservationTimeout() {
  const now = new Date();
  logger.info(`[Job: checkReservationTimeout] Executing reservation timeout check at ${now.toISOString()}...`);

  try {
    const Reservation = resolveModel('Reservation', '../models/Reservation.model');
    const InventoryUnit = resolveModel('InventoryUnit', '../models/InventoryUnit.model');

    if (!Reservation) {
      logger.warn('[Job: checkReservationTimeout] Reservation model is not registered yet. Skipping.');
      return { timedOutCount: 0, releasedUnitsCount: 0 };
    }

    // 1. Query active reservations that have timed out
    const timedOutReservations = await Reservation.find({
      status: 'ACTIVE',
      expiresAt: { $lt: now },
    }).lean();

    if (!timedOutReservations || timedOutReservations.length === 0) {
      logger.info('[Job: checkReservationTimeout] No timed-out reservations found.');
      return { timedOutCount: 0, releasedUnitsCount: 0 };
    }

    const reservationIds = timedOutReservations.map((r) => r._id);
    const unitIds = timedOutReservations
      .map((r) => r.inventoryUnit || r.inventoryUnitId || r.unit || r.unitId)
      .filter(Boolean);

    // 2. Set reservation status to EXPIRED
    const reservationResult = await Reservation.updateMany(
      { _id: { $in: reservationIds } },
      {
        $set: {
          status: 'EXPIRED',
          cancellationReason: 'Reservation confirmation window timed out',
          updatedAt: now,
        },
      }
    );
    const timedOutCount = reservationResult.modifiedCount || reservationIds.length;

    // 3. Set corresponding inventory units back to AVAILABLE (provided they haven't expired shelf life)
    let releasedUnitsCount = 0;
    if (InventoryUnit && unitIds.length > 0) {
      const inventoryResult = await InventoryUnit.updateMany(
        {
          _id: { $in: unitIds },
          status: 'RESERVED',
          expiryDate: { $gt: now },
        },
        {
          $set: {
            status: 'AVAILABLE',
            reservedFor: null,
            reservedAt: null,
            updatedAt: now,
          },
        }
      );
      releasedUnitsCount = inventoryResult.modifiedCount || 0;
    }

    logger.info(
      `[Job: checkReservationTimeout] Released ${timedOutCount} timed-out reservation(s) and restored ${releasedUnitsCount} inventory unit(s) to AVAILABLE.`
    );

    // 4. Emit Socket.io notifications
    try {
      const io = getIO();

      for (const res of timedOutReservations) {
        const bankId = res.bloodBank || res.bloodBankId;
        const reqId = res.bloodRequest || res.request || res.requestId;

        if (bankId) {
          io.to(bloodBankRoom(bankId)).emit('inventory.updated', {
            bloodBankId: bankId,
            reason: 'RESERVATION_TIMEOUT',
            reservationId: res._id,
            timestamp: now.toISOString(),
          });
        }

        if (reqId) {
          io.to(requestRoom(reqId)).emit('reservation.expired', {
            requestId: reqId,
            reservationId: res._id,
            message: 'Blood reservation expired and unit was released back to inventory',
            timestamp: now.toISOString(),
          });
        }
      }

      // Notify ADMIN role room
      io.to(roleRoom('ADMIN')).emit('reservation.timeout_batch', {
        timedOutCount,
        releasedUnitsCount,
        timestamp: now.toISOString(),
      });
    } catch (socketErr) {
      logger.debug(`[Job: checkReservationTimeout] Real-time socket broadcast skipped: ${socketErr.message}`);
    }

    return { timedOutCount, releasedUnitsCount };
  } catch (error) {
    logger.error(`[Job: checkReservationTimeout] Failed to execute job: ${error.message}`, { error });
    throw error;
  }
}

module.exports = {
  checkReservationTimeout,
};
