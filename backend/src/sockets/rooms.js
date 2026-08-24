/**
 * LifeLink - Socket.io Room Naming Conventions
 * Standardized room identifier helper functions for real-time communication.
 */

/**
 * Returns room name for a specific user
 * @param {string|object} userId
 * @returns {string} e.g. "user:60d0fe4f5311236168a109ca"
 */
const userRoom = (userId) => `user:${userId ? userId.toString() : ''}`;

/**
 * Returns room name for a specific blood request
 * @param {string|object} requestId
 * @returns {string} e.g. "request:60d0fe4f5311236168a109cb"
 */
const requestRoom = (requestId) => `request:${requestId ? requestId.toString() : ''}`;

/**
 * Returns room name for a specific blood bank
 * @param {string|object} bloodBankId
 * @returns {string} e.g. "bloodbank:60d0fe4f5311236168a109cc"
 */
const bloodBankRoom = (bloodBankId) => `bloodbank:${bloodBankId ? bloodBankId.toString() : ''}`;

/**
 * Returns room name for a specific hospital
 * @param {string|object} hospitalId
 * @returns {string} e.g. "hospital:60d0fe4f5311236168a109cd"
 */
const hospitalRoom = (hospitalId) => `hospital:${hospitalId ? hospitalId.toString() : ''}`;

/**
 * Returns room name for notifying eligible donors for a specific request
 * @param {string|object} requestId
 * @returns {string} e.g. "donors:eligible:60d0fe4f5311236168a109cb"
 */
const eligibleDonorsRoom = (requestId) => `donors:eligible:${requestId ? requestId.toString() : ''}`;

/**
 * Returns room name for role-based broadcast notifications
 * @param {string} role - PATIENT, DONOR, HOSPITAL, BLOOD_BANK, ADMIN
 * @returns {string} e.g. "role:donor", "role:blood_bank"
 */
const roleRoom = (role) => `role:${role ? role.toString().toLowerCase() : ''}`;

module.exports = {
  userRoom,
  requestRoom,
  bloodBankRoom,
  hospitalRoom,
  eligibleDonorsRoom,
  roleRoom,
};
