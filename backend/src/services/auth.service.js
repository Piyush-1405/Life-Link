const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Donor = require('../models/Donor.model');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register(userData) {
    const { email, password, role, firstName, lastName, phone, ...profileData } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Create user - virtual 'password' setter triggers pre-save hash
    const user = await User.create({
      email,
      password, // uses virtual setter -> passwordHash -> pre-save bcrypt hash
      role,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || ''
    });

    // Create profile based on role
    try {
      if (role === 'PATIENT') {
        await Patient.create({ userId: user._id, ...profileData });
      } else if (role === 'DONOR') {
        await Donor.create({ userId: user._id, ...profileData });
      }
    } catch (error) {
      // Rollback user creation if profile fails
      await User.findByIdAndDelete(user._id);
      throw error;
    }

    return user.toJSON();
  }

  async login(email, password) {
    // Must select passwordHash explicitly since it has select:false
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY || '7d' }
    );

    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    return { user: user.toJSON(), accessToken, refreshToken };
  }

  async refreshToken(token) {
    if (!token) {
      throw new ApiError(401, 'Refresh token required');
    }

    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== token) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRY || '15m' }
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) throw new ApiError(404, 'User not found');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new ApiError(400, 'Invalid old password');

    user.password = newPassword; // virtual setter -> pre-save hash
    user.refreshToken = null; // Revoke existing session
    await user.save();
  }
}

module.exports = new AuthService();
