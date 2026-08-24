/**
 * LifeLink - Blood Donation Management System
 * JWT Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Lazily loads the User model to prevent circular dependency issues
 * @returns {mongoose.Model}
 */
const getUserModel = () => {
  if (mongoose.models && mongoose.models.User) {
    return mongoose.models.User;
  }
  try {
  return require('../models/User.model');
  } catch (err) {
    throw new ApiError(500, 'User model is not registered');
  }
};

/**
 * Middleware to authenticate requests via JWT Bearer token
 */
const auth = asyncHandler(async (req, _res, next) => {
  let token = null;

  // 1. Extract Bearer token from Authorization header or cookie
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(
      401,
      'Authentication token is required. Please provide a valid Bearer token in the Authorization header.'
    );
  }

  // 2. Verify token signature and expiration
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token has expired. Please refresh your token or log in again.');
    }
    throw new ApiError(401, 'Invalid authentication token. Authorization failed.');
  }

  // 3. Extract user ID from payload
  const userId = decoded.id || decoded._id || decoded.userId;
  if (!userId) {
    throw new ApiError(401, 'Invalid token payload: user identifier missing.');
  }

  // 4. Retrieve user from database (excluding sensitive fields)
  const User = getUserModel();
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(401, 'The user associated with this token does not exist or has been removed.');
  }

  // 5. Check if user account is deactivated or blocked
  if (user.isActive === false || user.status === 'BLOCKED' || user.status === 'DEACTIVATED') {
    throw new ApiError(403, 'Account is currently inactive or suspended. Please contact administrator.');
  }

  // 6. Attach user to request object
  req.user = user;
  next();
});

module.exports = auth;
module.exports.auth = auth;
module.exports.authenticate = auth;
