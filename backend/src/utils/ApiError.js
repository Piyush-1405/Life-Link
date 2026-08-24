/**
 * LifeLink - Blood Donation Management System
 * Custom Operational API Error Class
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP Status Code
   * @param {string} message - Error message
   * @param {Array<any>|string} [errors=[]] - Detailed errors or validation failure items
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors : [errors].filter(Boolean);
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Helper factory methods for common HTTP error codes
   */
  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized access', errors = []) {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = 'Forbidden access', errors = []) {
    return new ApiError(403, message, errors);
  }

  static notFound(message = 'Resource not found', errors = []) {
    return new ApiError(404, message, errors);
  }

  static conflict(message = 'Resource conflict', errors = []) {
    return new ApiError(409, message, errors);
  }

  static unprocessableEntity(message = 'Validation failed', errors = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = 'Internal Server Error', errors = []) {
    return new ApiError(500, message, errors);
  }
}

module.exports = ApiError;
