const BloodRequest = require('../models/BloodRequest.model');
const Donor = require('../models/donor.model');
const compatibilityService = require('./compatibility.service');
const notificationService = require('./notification.service');
const ApiError = require('../utils/ApiError');

class DonorMatchService {
  async findEligibleDonors(requestId) {
    const request = await BloodRequest.findById(requestId).lean();
    if (!request) throw new ApiError(404, 'Request not found');

    const compatibleGroups = compatibilityService.getCompatibleDonorGroups(request.bloodGroup, request.component);
    
    // Default search radius to 50km
    const radiusInKm = request.searchRadiusKm || 50;

    // Note: In real app, user model active check requires lookup/populate or denormalization
    const donors = await Donor.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: request.location.coordinates },
          distanceField: 'distance',
          maxDistance: radiusInKm * 1000,
          spherical: true,
          query: {
            bloodGroup: { $in: compatibleGroups },
            isAvailable: true
          }
        }
      }
    ]);

    // Post-filter logic: Last donation interval
    const now = new Date();
    const MIN_DONATION_INTERVAL_DAYS = 56; // typical for whole blood

    const eligibleDonors = donors.filter(donor => {
      if (!donor.lastDonationDate) return true;
      const daysSinceLastDonation = (now - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24);
      return daysSinceLastDonation >= MIN_DONATION_INTERVAL_DAYS;
    });

    // Sort: distance ASC, exact match first
    eligibleDonors.sort((a, b) => {
      const aExact = a.bloodGroup === request.bloodGroup ? 1 : 0;
      const bExact = b.bloodGroup === request.bloodGroup ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      return a.distance - b.distance;
    });

    return eligibleDonors;
  }

  async findAndNotifyDonors(requestId) {
    const eligibleDonors = await this.findEligibleDonors(requestId);
    
    // Keep top N donors
    const topDonors = eligibleDonors.slice(0, 10);
    
    if (topDonors.length === 0) {
      return; // No donors found
    }

    const request = await BloodRequest.findById(requestId);
    
    // Add to matchedDonors
    const matched = topDonors.map(d => ({
      donor: d._id,
      status: 'NOTIFIED',
      distanceKm: d.distance / 1000
    }));

    request.matchedDonors.push(...matched);
    await request.save();

    // Send notifications
    for (const donor of topDonors) {
      await notificationService.create(
        donor.user, // assuming donor.user holds userId
        'DONATION_REQUEST',
        'Urgent Blood Required',
        `A patient nearby needs ${request.bloodGroup} blood.`,
        { requestId: request._id }
      );
    }
  }

  async handleDonorResponse(requestId, donorId, action) {
    const request = await BloodRequest.findById(requestId);
    if (!request) throw new ApiError(404, 'Request not found');

    const match = request.matchedDonors.find(m => m.donor.toString() === donorId.toString());
    if (!match) throw new ApiError(404, 'Donor not matched to this request');

    if (action === 'ACCEPT') {
      match.status = 'ACCEPTED';
      request.status = 'DONOR_ACCEPTED';
      request.statusHistory.push({
        status: 'DONOR_ACCEPTED',
        timestamp: new Date(),
        note: `Donor ${donorId} accepted`
      });

      // Notify patient
      await notificationService.create(
        request.patient.user || request.patient,
        'DONOR_FOUND',
        'Donor Accepted',
        'A matching donor has accepted your request.',
        { requestId: request._id }
      );
    } else if (action === 'REJECT') {
      match.status = 'REJECTED';
    }

    await request.save();
    return request;
  }
}

module.exports = new DonorMatchService();
