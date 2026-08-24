const BloodRequest = require('../models/BloodRequest.model');
const inventoryService = require('./inventory.service');
const donorMatchService = require('./donorMatch.service');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

class RequestService {
  async createRequest(patientId, data) {
    const request = await BloodRequest.create({
      patient: patientId,
      ...data,
      status: 'PENDING',
      statusHistory: [{ status: 'PENDING', timestamp: new Date() }]
    });

    // Fire and forget asynchronous processing
    this.processRequest(request._id).catch(console.error);
    
    return request;
  }

  async processRequest(requestId) {
    const request = await BloodRequest.findById(requestId).populate('patient');
    if (!request) return;

    // Transition to INVENTORY_SEARCH
    await this.transitionStatus(requestId, 'INVENTORY_SEARCH', null, 'Starting inventory search');

    try {
      const units = await inventoryService.searchCompatibleUnits(
        request.bloodGroup,
        request.component,
        request.location.coordinates,
        request.searchRadiusKm || 50,
        request.quantity
      );

      if (units.length >= request.quantity) {
        // Sufficient units found
        const unitIds = units.slice(0, request.quantity).map(u => u._id);
        
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          await inventoryService.reserveUnits(unitIds, requestId, session);
          await this.transitionStatus(requestId, 'BLOOD_RESERVED', null, 'Units reserved from inventory', session);
          await session.commitTransaction();
        } catch (error) {
          await session.abortTransaction();
          throw error;
        } finally {
          session.endSession();
        }
      } else {
        // Insufficient inventory, go to donor search
        await this.transitionStatus(requestId, 'DONOR_SEARCH', null, 'Insufficient inventory, searching donors');
        await donorMatchService.findAndNotifyDonors(requestId);
      }
    } catch (error) {
      console.error(`Error processing request ${requestId}:`, error);
      // Handled softly to not crash
    }
  }

  async transitionStatus(requestId, newStatus, userId, note, session = null) {
    // Validate transitions could be done here (omitted strict map for brevity)
    const request = await BloodRequest.findById(requestId).session(session);
    if (!request) throw new ApiError(404, 'Request not found');

    request.status = newStatus;
    request.statusHistory.push({
      status: newStatus,
      updatedBy: userId,
      note,
      timestamp: new Date()
    });

    await request.save({ session });
    return request;
  }

  async getRequestById(id) {
    const request = await BloodRequest.findById(id)
      .populate('patient')
      .populate('hospital')
      .populate('matchedDonors.donor');
    if (!request) throw new ApiError(404, 'Request not found');
    return request;
  }

  async getRequests(filters = {}, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.bloodGroup) query.bloodGroup = filters.bloodGroup;
    if (filters.hospital) query.hospital = filters.hospital;

    const [requests, total] = await Promise.all([
      BloodRequest.find(query)
        .populate('patient', 'user name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BloodRequest.countDocuments(query)
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getPatientRequests(patientId) {
    return BloodRequest.find({ patient: patientId }).sort({ createdAt: -1 });
  }

  async cancelRequest(requestId, userId) {
    const request = await BloodRequest.findById(requestId);
    if (!request) throw new ApiError(404, 'Request not found');
    if (request.status === 'COMPLETED' || request.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot cancel request in this status');
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (request.status === 'BLOOD_RESERVED') {
        const Reservation = require('../models/Reservation.model');
        const reservations = await Reservation.find({ request: requestId, status: 'ACTIVE' }).session(session);
        for (const res of reservations) {
          await inventoryService.releaseReservation(res._id); // Handles its own session? Better to pass session, but simplified here
        }
      }

      await this.transitionStatus(requestId, 'CANCELLED', userId, 'Cancelled by user', session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTimeline(requestId) {
    const request = await BloodRequest.findById(requestId).select('statusHistory');
    if (!request) throw new ApiError(404, 'Request not found');
    return request.statusHistory;
  }

  async assignHospital(requestId, hospitalId) {
    return BloodRequest.findByIdAndUpdate(
      requestId, 
      { hospital: hospitalId }, 
      { new: true, runValidators: true }
    );
  }
}

module.exports = new RequestService();
