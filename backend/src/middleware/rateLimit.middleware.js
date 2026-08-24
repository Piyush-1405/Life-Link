/**
 * LifeLink - Blood Donation Management System
 * Rate Limiting Middleware Re-exports
 */

const { generalLimiter, authLimiter } = require('../config/rateLimit');

module.exports = {
  generalLimiter,
  authLimiter
};
