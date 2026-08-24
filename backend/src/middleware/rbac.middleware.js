/**
 * LifeLink - Blood Donation Management System
 * Role-Based Access Control (RBAC) Middleware
 */

const ApiError = require('../utils/ApiError');

/**
 * Factory function to authorize users based on their assigned role
 *
 * @param {...(string|string[])} roles - Allowed roles (e.g. 'ADMIN', 'HOSPITAL', or ['ADMIN', 'BLOOD_BANK'])
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => {
  // Flatten array in case an array or rest parameters are passed
  const allowedRoles = roles.flat();

  return (req, _res, next) => {
    // 1. Ensure user is authenticated first
    if (!req.user) {
      return next(
        new ApiError(401, 'Unauthorized: You must be logged in to access this resource.')
      );
    }

    // 2. Check if the user's role is permitted
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Forbidden: Role '${req.user.role}' does not have permission to access this resource. Allowed roles: [${allowedRoles.join(', ')}]`
        )
      );
    }

    // 3. User is authorized
    return next();
  };
};

module.exports = authorize;
module.exports.authorize = authorize;
module.exports.rbac = authorize;
module.exports.authorizeRoles = authorize;
