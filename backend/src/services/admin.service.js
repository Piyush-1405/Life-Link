const mongoose = require('mongoose');
const User = require('../models/User.model');
const Hospital = require('../models/Hospital.model');
const BloodBank = require('../models/BloodBank.model');
const BloodRequest = require('../models/BloodRequest.model');
const InventoryUnit = require('../models/InventoryUnit.model');
const DonationRecord = require('../models/DonationRecord.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');

class AdminService {
  async getUsers(filters = {}) {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive === 'true' || filters.isActive === true;
    }
    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified === 'true' || filters.isVerified === true;
    }
    if (filters.search) {
      query.$or = [
        { email: { $regex: filters.search, $options: 'i' } },
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).select('-passwordHash -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();
    return user.toJSON();
  }

  async verifyEntity(entityId) {
    if (mongoose.isValidObjectId(entityId)) {
      let entity = await Hospital.findOneAndUpdate(
        { $or: [{ _id: entityId }, { userId: entityId }] },
        { isVerified: true },
        { new: true }
      );
      if (entity) return entity;

      entity = await BloodBank.findOneAndUpdate(
        { $or: [{ _id: entityId }, { userId: entityId }] },
        { isVerified: true },
        { new: true }
      );
      if (entity) return entity;

      const user = await User.findById(entityId);
      if (user) {
        if (user.role === 'HOSPITAL') {
          entity = await Hospital.findOneAndUpdate({ userId: entityId }, { isVerified: true }, { new: true });
        } else if (user.role === 'BLOOD_BANK') {
          entity = await BloodBank.findOneAndUpdate({ userId: entityId }, { isVerified: true }, { new: true });
        }
        if (entity) return entity;
      }
    }

    throw new ApiError(404, 'Entity not found or not eligible for verification');
  }

  async getDashboard() {
    const [
      totalUsers,
      usersByRole,
      totalHospitals,
      verifiedHospitals,
      totalBloodBanks,
      verifiedBloodBanks,
      requestsByStatus,
      inventoryByStatus,
      totalDonations
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Hospital.countDocuments(),
      Hospital.countDocuments({ isVerified: true }),
      BloodBank.countDocuments(),
      BloodBank.countDocuments({ isVerified: true }),
      BloodRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      InventoryUnit.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      DonationRecord.countDocuments()
    ]);

    return {
      users: { total: totalUsers, byRole: usersByRole },
      hospitals: { total: totalHospitals, verified: verifiedHospitals },
      bloodBanks: { total: totalBloodBanks, verified: verifiedBloodBanks },
      requests: { byStatus: requestsByStatus },
      inventory: { byStatus: inventoryByStatus },
      donations: { total: totalDonations }
    };
  }

  async getAnalytics(query = {}) {
    const [
      requestsByBloodGroup,
      inventoryByBloodGroup,
      donationsByStatus
    ] = await Promise.all([
      BloodRequest.aggregate([{ $group: { _id: '$bloodGroup', count: { $sum: 1 } } }]),
      InventoryUnit.aggregate([{ $group: { _id: '$bloodGroup', count: { $sum: 1 }, totalVolume: { $sum: '$volumeMl' } } }]),
      DonationRecord.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);

    return {
      requestsByBloodGroup,
      inventoryByBloodGroup,
      donationsByStatus
    };
  }

  async getAuditLogs(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.actor) filter.actor = query.actor;
    if (query.entity) filter.entity = query.entity;
    if (query.action) filter.action = query.action;
    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('actor', 'email role firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filter)
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createHospital(data) {
    const { email, password, name, registrationNumber, phone, location, address, contactPerson, contactPhone } = data;

    let user = null;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
      }
      user = await User.create({
        email,
        password: password || 'Hospital@123',
        role: 'HOSPITAL',
        phone: contactPhone || phone || '',
        isVerified: true
      });
    }

    const hospital = await Hospital.create({
      userId: user ? user._id : data.userId,
      name,
      registrationNumber,
      location: location || { type: 'Point', coordinates: [0, 0] },
      address: address || {},
      contactPerson: contactPerson || '',
      contactPhone: contactPhone || phone || '',
      isVerified: data.isVerified !== undefined ? data.isVerified : true
    });

    return hospital;
  }

  async createBloodBank(data) {
    const { email, password, name, licenseNumber, phone, location, address, contactPerson, contactPhone, operatingHours, config } = data;

    let user = null;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
      }
      user = await User.create({
        email,
        password: password || 'BloodBank@123',
        role: 'BLOOD_BANK',
        phone: contactPhone || phone || '',
        isVerified: true
      });
    }

    const bloodBank = await BloodBank.create({
      userId: user ? user._id : data.userId,
      name,
      licenseNumber,
      location: location || { type: 'Point', coordinates: [0, 0] },
      address: address || {},
      contactPerson: contactPerson || '',
      contactPhone: contactPhone || phone || '',
      operatingHours: operatingHours || { open: '08:00', close: '20:00' },
      config: config || {},
      isVerified: data.isVerified !== undefined ? data.isVerified : true
    });

    return bloodBank;
  }
}

module.exports = new AdminService();
