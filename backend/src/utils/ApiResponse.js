/**
 * LifeLink - Blood Donation Management System
 * Standardized API Response Class
 */

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} [data=null] - Payload returned in the response
   * @param {string} [message='Success'] - Response summary message
   */
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  /**
   * Helper method to directly send response via Express res object
   * @param {import('express').Response} res
   * @returns {import('express').Response}
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }

  /**
   * Factory method for standard 200 OK responses
   */
  static ok(data = null, message = 'Operation successful') {
    return new ApiResponse(200, data, message);
  }

  /**
   * Factory method for standard 201 Created responses
   */
  static created(data = null, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  /**
   * Factory method for 204 No Content responses
   */
  static noContent(message = 'No content') {
    return new ApiResponse(204, null, message);
  }
}

module.exports = ApiResponse;
