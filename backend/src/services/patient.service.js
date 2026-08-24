const Patient = require('../models/patient.model');
const ApiError = require('../utils/ApiError');

class PatientService {
  async getProfile(userId) {
    const profile = await Patient.findOne({ user: userId }).populate('user', '-password');
    if (!profile) throw new ApiError(404, 'Patient profile not found');
    return profile;
  }

  async updateProfile(userId, updates) {
    const profile = await Patient.findOneAndUpdate(
      { user: userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!profile) throw new ApiError(404, 'Patient profile not found');
    return profile;
  }
}

module.exports = new PatientService();
