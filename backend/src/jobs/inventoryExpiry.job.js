const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { getIO } = require('../sockets/index');
const { bloodBankRoom, roleRoom } = require('../sockets/rooms');

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
 * Scheduled job to check and mark expired blood inventory units.
 * - Transitions status from AVAILABLE/RESERVED to EXPIRED when expiryDate < now
 * - Releases associated active reservations
 * - Logs expired counts
 * - Emits 'inventory.updated' events to affected blood banks via Socket.io
 */
async function checkInventoryExpiry() {
  const now = new Date();
  logger.info(`[Job: checkInventoryExpiry] Executing inventory expiry check at ${now.toISOString()}...`);

  try {
    const InventoryUnit = resolveModel('InventoryUnit', '../models/InventoryUnit.model');
    const Reservation = resolveModel('Reservation', '../models/Reservation.model');

    if (!InventoryUnit) {
      logger.warn('[Job: checkInventoryExpiry] InventoryUnit model is not registered yet. Skipping.');
      return { expiredCount: 0, releasedReservationsCount: 0 };
    }

    // 1. Query units with status AVAILABLE or RESERVED whose expiryDate is in the past
    const expiredUnits = await InventoryUnit.find({
      status: { $in: ['AVAILABLE', 'RESERVED'] },
      expiryDate: { $lt: now },
    }).lean();

    if (!expiredUnits || expiredUnits.length === 0) {
      logger.info('[Job: checkInventoryExpiry] No expired inventory units found.');
      return { expiredCount: 0, releasedReservationsCount: 0 };
    }

    const expiredUnitIds = expiredUnits.map((unit) => unit._id);
    const reservedUnits = expiredUnits.filter((unit) => unit.status === 'RESERVED');
    const reservedUnitIds = reservedUnits.map((unit) => unit._id);

    let releasedReservationsCount = 0;

    // 2. Release active reservations linked to expired units
    if (Reservation && reservedUnitIds.length > 0) {
      const reservationResult = await Reservation.updateMany(
        {
          $or: [
            { inventoryUnit: { $in: reservedUnitIds } },
            { inventoryUnitId: { $in: reservedUnitIds } },
            { unit: { $in: reservedUnitIds } },
          ],
          status: 'ACTIVE',
        },
        {
          $set: {
            status: 'EXPIRED',
            cancellationReason: 'Blood unit expired during reservation',
            updatedAt: now,
          },
        }
      );
      releasedReservationsCount = reservationResult.modifiedCount || 0;
      logger.info(
        `[Job: checkInventoryExpiry] Released ${releasedReservationsCount} active reservation(s) linked to expired blood units.`
      );
    }

    // 3. Update inventory units to EXPIRED
    const updateResult = await InventoryUnit.updateMany(
      { _id: { $in: expiredUnitIds } },
      {
        $set: {
          status: 'EXPIRED',
          reservationId: null,
          reservedFor: null,
          updatedAt: now,
        },
      }
    );

    const expiredCount = updateResult.modifiedCount || expiredUnitIds.length;
    logger.warn(
      `[Job: checkInventoryExpiry] Marked ${expiredCount} blood inventory unit(s) as EXPIRED.`
    );

    // 4. Emit 'inventory.updated' via Socket.io for affected blood banks
    try {
      const io = getIO();
      const affectedBankIds = [
        ...new Set(
          expiredUnits
            .map((u) => u.bloodBank || u.bloodBankId || u.bankId)
            .filter(Boolean)
            .map((id) => id.toString())
        ),
      ];

      for (const bankId of affectedBankIds) {
        const countForBank = expiredUnits.filter(
          (u) => (u.bloodBank || u.bloodBankId || u.bankId)?.toString() === bankId
        ).length;

        io.to(bloodBankRoom(bankId)).emit('inventory.updated', {
          bloodBankId: bankId,
          reason: 'INVENTORY_EXPIRED',
          expiredCount: countForBank,
          timestamp: now.toISOString(),
        });
      }

      // Notify ADMIN role room of the batch expiry
      io.to(roleRoom('ADMIN')).emit('inventory.updated', {
        reason: 'INVENTORY_EXPIRED_BATCH',
        totalExpired: expiredCount,
        releasedReservations: releasedReservationsCount,
        timestamp: now.toISOString(),
      });
    } catch (socketErr) {
      logger.debug(`[Job: checkInventoryExpiry] Real-time socket broadcast skipped: ${socketErr.message}`);
    }

    return { expiredCount, releasedReservationsCount };
  } catch (error) {
    logger.error(`[Job: checkInventoryExpiry] Failed to execute job: ${error.message}`, { error });
    throw error;
  }
}

module.exports = {
  checkInventoryExpiry,
};
