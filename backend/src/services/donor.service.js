const Donor = require('../models/donor.model');
const BloodRequest = require('../models/BloodRequest.model');
const compatibilityService = require('./compatibility.service');
const ApiError = require('../utils/ApiError');

class DonorService {
  async getProfile(userId) {
    const profile = await Donor.findOne({ user: userId }).populate('user', '-password');
    if (!profile) throw new ApiError(404, 'Donor profile not found');
    return profile;
  }

  async updateProfile(userId, updates) {
    const profile = await Donor.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!profile) throw new ApiError(404, 'Donor profile not found');
    return profile;
  }

  async toggleAvailability(userId, isAvailable) {
    const profile = await Donor.findOneAndUpdate(
      { user: userId },
      { isAvailable },
      { new: true }
    );
    if (!profile) throw new ApiError(404, 'Donor profile not found');
    return profile;
  }

  async getEligibleRequests(donorId) {
    const donor = await Donor.findById(donorId);
    if (!donor) throw new ApiError(404, 'Donor not found');
    if (!donor.isAvailable) return [];

    const now = new Date();
    if (donor.lastDonationDate) {
      const daysSince = (now - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24);
      if (daysSince < 56) return []; // Ineligible
    }

    const compatibleRecipients = compatibilityService.getCompatibleRecipientGroups(donor.bloodGroup, 'WHOLE_BLOOD');

    // Find requests
    const requests = await BloodRequest.aggregate([
      {
        $geoNear: {
          near: donor.location,
          distanceField: 'distance',
          maxDistance: 50000, // 50km
          spherical: true,
          query: {
            status: 'DONOR_SEARCH',
            bloodGroup: { $in: compatibleRecipients }
          }
        }
      }
    ]);

    return requests;
  }
}

module.exports = new DonorService();
