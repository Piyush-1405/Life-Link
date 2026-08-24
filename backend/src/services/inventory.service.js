const mongoose = require('mongoose');
const InventoryUnit = require('../models/InventoryUnit.model');
const Reservation = require('../models/Reservation.model');
const compatibilityService = require('./compatibility.service');
const ApiError = require('../utils/ApiError');

class InventoryService {
  async addUnit(data) {
    const isFromDonation = !!data.donationId;
    return InventoryUnit.create({
      ...data,
      status: isFromDonation ? 'QUARANTINE' : 'AVAILABLE'
    });
  }

  async getUnits(filters = {}, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.bloodBank) query.bloodBank = filters.bloodBank;
    if (filters.bloodGroup) query.bloodGroup = filters.bloodGroup;
    if (filters.component) query.component = filters.component;
    if (filters.status) query.status = filters.status;

    const [units, total] = await Promise.all([
      InventoryUnit.find(query)
        .populate('bloodBank', 'name location')
        .sort({ expiryDate: 1 })
        .skip(skip)
        .limit(limit),
      InventoryUnit.countDocuments(query)
    ]);

    return {
      units,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUnitById(id) {
    const unit = await InventoryUnit.findById(id).populate('bloodBank', 'name location');
    if (!unit) throw new ApiError(404, 'Inventory unit not found');
    return unit;
  }

  async updateUnit(id, updates) {
    const unit = await InventoryUnit.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!unit) throw new ApiError(404, 'Inventory unit not found');
    return unit;
  }

  async searchCompatibleUnits(bloodGroup, component, location, radiusKm, quantity) {
    const compatibleGroups = compatibilityService.getCompatibleDonorGroups(bloodGroup, component);
    
    // Aggregation pipeline to find units near location
    const units = await InventoryUnit.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: location },
          distanceField: 'distance',
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: {
            bloodGroup: { $in: compatibleGroups },
            component,
            status: 'AVAILABLE',
            expiryDate: { $gt: new Date() }
          }
        }
      },
      { $sort: { distance: 1, expiryDate: 1 } },
      { $limit: quantity }
    ]);

    return units;
  }

  async reserveUnits(unitIds, requestId, session) {
    // Atomically find and update units
    const result = await InventoryUnit.updateMany(
      { _id: { $in: unitIds }, status: 'AVAILABLE' },
      { $set: { status: 'RESERVED' } },
      { session }
    );

    if (result.modifiedCount !== unitIds.length) {
      throw new ApiError(409, 'One or more units are no longer available');
    }

    // Create reservation records
    const reservations = unitIds.map(unitId => ({
      unit: unitId,
      request: requestId,
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours reservation
    }));

    await Reservation.insertMany(reservations, { session });
    return reservations;
  }

  async releaseReservation(reservationId) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new ApiError(404, 'Reservation not found');

    if (reservation.status !== 'ACTIVE') {
      throw new ApiError(400, 'Reservation is not active');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      reservation.status = 'RELEASED';
      await reservation.save({ session });

      await InventoryUnit.findByIdAndUpdate(
        reservation.unit,
        { status: 'AVAILABLE' },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async markExpired() {
    const now = new Date();
    const result = await InventoryUnit.updateMany(
      { 
        status: { $in: ['AVAILABLE', 'RESERVED', 'QUARANTINE'] },
        expiryDate: { $lt: now } 
      },
      { $set: { status: 'EXPIRED' } }
    );
    return result.modifiedCount;
  }

  async getStats(bloodBankId) {
    const stats = await InventoryUnit.aggregate([
      { $match: { bloodBank: new mongoose.Types.ObjectId(bloodBankId) } },
      {
        $group: {
          _id: {
            bloodGroup: '$bloodGroup',
            component: '$component',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);
    return stats;
  }

  async getExpiringUnits(bloodBankId, daysAhead) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return InventoryUnit.find({
      bloodBank: bloodBankId,
      status: 'AVAILABLE',
      expiryDate: { $lt: targetDate, $gt: new Date() }
    }).sort({ expiryDate: 1 });
  }
}

module.exports = new InventoryService();
