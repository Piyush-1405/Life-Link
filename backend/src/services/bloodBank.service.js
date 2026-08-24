const BloodBank = require('../models/bloodBank.model');
const InventoryUnit = require('../models/InventoryUnit.model');
const DonationRecord = require('../models/DonationRecord.model');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

class BloodBankService {
  async getProfile(userId) {
    const profile = await BloodBank.findOne({ user: userId }).populate('user', '-password');
    if (!profile) throw new ApiError(404, 'Blood Bank profile not found');
    return profile;
  }

  async updateProfile(userId, updates) {
    const profile = await BloodBank.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!profile) throw new ApiError(404, 'Blood Bank profile not found');
    return profile;
  }

  async updateConfig(userId, config) {
    const profile = await BloodBank.findOneAndUpdate(
      { user: userId },
      { settings: config },
      { new: true }
    );
    if (!profile) throw new ApiError(404, 'Blood Bank profile not found');
    return profile;
  }

  async getDashboardStats(bloodBankId) {
    const bloodBankObjId = new mongoose.Types.ObjectId(bloodBankId);
    
    const [inventoryStats, donationStats] = await Promise.all([
      InventoryUnit.aggregate([
        { $match: { bloodBank: bloodBankObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      DonationRecord.aggregate([
        { $match: { bloodBank: bloodBankObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    return { inventoryStats, donationStats };
  }
}

module.exports = new BloodBankService();
