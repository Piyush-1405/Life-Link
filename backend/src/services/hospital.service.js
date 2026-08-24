const Hospital = require('../models/hospital.model');
const BloodRequest = require('../models/BloodRequest.model');
const ApiError = require('../utils/ApiError');

class HospitalService {
  async getProfile(userId) {
    const profile = await Hospital.findOne({ user: userId }).populate('user', '-password');
    if (!profile) throw new ApiError(404, 'Hospital profile not found');
    return profile;
  }

  async updateProfile(userId, updates) {
    const profile = await Hospital.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!profile) throw new ApiError(404, 'Hospital profile not found');
    return profile;
  }

  async getAssignedRequests(hospitalId, filters = {}) {
    return BloodRequest.find({ hospital: hospitalId, ...filters })
      .populate('patient')
      .sort({ createdAt: -1 });
  }

  async getDashboardStats(hospitalId) {
    const stats = await BloodRequest.aggregate([
      { $match: { hospital: hospitalId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    return stats;
  }
}

module.exports = new HospitalService();
