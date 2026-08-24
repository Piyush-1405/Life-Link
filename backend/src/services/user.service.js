const User = require('../models/User.model');
const Patient = require('../models/patient.model');
const Donor = require('../models/donor.model');
const Hospital = require('../models/hospital.model');
const BloodBank = require('../models/bloodBank.model');
const ApiError = require('../utils/ApiError');

class UserService {
  async getUserById(id) {
    const user = await User.findById(id).select('-password');
    if (!user) throw new ApiError(404, 'User not found');

    let profile = null;
    switch (user.role) {
      case 'PATIENT':
        profile = await Patient.findOne({ user: id });
        break;
      case 'DONOR':
        profile = await Donor.findOne({ user: id });
        break;
      case 'HOSPITAL':
        profile = await Hospital.findOne({ user: id });
        break;
      case 'BLOOD_BANK':
        profile = await BloodBank.findOne({ user: id });
        break;
    }

    const userObj = user.toObject();
    userObj.profile = profile;
    return userObj;
  }

  async updateProfile(userId, updates) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async updateLocation(userId, coordinates) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    let model;
    switch (user.role) {
      case 'PATIENT': model = Patient; break;
      case 'DONOR': model = Donor; break;
      case 'HOSPITAL': model = Hospital; break;
      case 'BLOOD_BANK': model = BloodBank; break;
      default: throw new ApiError(400, 'Role does not support location');
    }

    const profile = await model.findOneAndUpdate(
      { user: userId },
      { location: { type: 'Point', coordinates } },
      { new: true }
    );
    return profile;
  }

  async getAllUsers(filters = {}, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit),
      User.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async toggleUserStatus(userId, isActive) {
    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async verifyEntity(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    
    let model;
    if (user.role === 'HOSPITAL') model = Hospital;
    else if (user.role === 'BLOOD_BANK') model = BloodBank;
    else throw new ApiError(400, 'Can only verify Hospital or Blood Bank');

    const entity = await model.findOneAndUpdate({ user: userId }, { isVerified: true }, { new: true });
    return entity;
  }
}

module.exports = new UserService();
