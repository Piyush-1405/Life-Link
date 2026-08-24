const DonationRecord = require('../models/DonationRecord.model');
const inventoryService = require('./inventory.service');
const requestService = require('./request.service');
const Donor = require('../models/donor.model');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

class DonationService {
  async createDonation(data) {
    return DonationRecord.create({
      ...data,
      status: 'SCHEDULED',
      statusHistory: [{ status: 'SCHEDULED', timestamp: new Date() }]
    });
  }

  async getDonationById(id) {
    const donation = await DonationRecord.findById(id)
      .populate('donor')
      .populate('bloodBank');
    if (!donation) throw new ApiError(404, 'Donation not found');
    return donation;
  }

  async getDonations(filters = {}, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [donations, total] = await Promise.all([
      DonationRecord.find(filters)
        .populate('donor')
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(limit),
      DonationRecord.countDocuments(filters)
    ]);

    return {
      donations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getDonorDonations(donorId) {
    return DonationRecord.find({ donor: donorId }).sort({ appointmentDate: -1 });
  }

  async transitionStatus(donationId, newStatus, userId, note) {
    const donation = await DonationRecord.findById(donationId);
    if (!donation) throw new ApiError(404, 'Donation not found');

    donation.status = newStatus;
    donation.statusHistory.push({
      status: newStatus,
      updatedBy: userId,
      note,
      timestamp: new Date()
    });

    await donation.save();
    return donation;
  }

  async completeDonation(donationId, unitData, userId) {
    const donation = await DonationRecord.findById(donationId).populate('donor');
    if (!donation) throw new ApiError(404, 'Donation not found');
    if (donation.status === 'COMPLETED') throw new ApiError(400, 'Donation already completed');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Mark completed
      donation.status = 'COMPLETED';
      donation.statusHistory.push({
        status: 'COMPLETED',
        updatedBy: userId,
        timestamp: new Date()
      });

      // 2. Create inventory units
      const units = [];
      for (const ud of unitData) {
        const unit = await inventoryService.addUnit({
          ...ud,
          donationId: donation._id,
          bloodGroup: donation.donor.bloodGroup,
          bloodBank: donation.bloodBank,
          collectionDate: new Date()
        });
        units.push(unit._id);
      }
      
      // 3. Link inventory
      donation.inventoryUnits = units;
      await donation.save({ session });

      // 4. Update donor
      await Donor.findByIdAndUpdate(donation.donor._id, {
        lastDonationDate: new Date(),
        $inc: { totalDonations: 1 }
      }, { session });

      // 5. If linked to request, check fulfillment
      if (donation.request) {
        // Simple logic for fulfillment trigger
        await requestService.transitionStatus(
          donation.request, 
          'DONATION_COMPLETED', 
          userId, 
          'Linked donation completed', 
          session
        );
      }

      await session.commitTransaction();
      return donation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new DonationService();
