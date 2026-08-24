/**
 * LifeLink - Blood Donation Management System
 * Global Error Handler Middleware
 */

const env = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Express centralized error-handling middleware
 *
 * @param {Error|ApiError} err - Error object thrown in application
 * @param {import('express').Request} req - Express Request
 * @param {import('express').Response} res - Express Response
 * @param {import('express').NextFunction} next - Express NextFunction
 */
const errorHandler = (err, req, res, _next) => {
  let error = err;

  // Convert non-ApiError exceptions to normalized ApiError instances
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors = [];

    // Mongoose Validation Error (Schema constraint violations)
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      errors = Object.values(error.errors || {}).map((item) => item.message || item.toString());
    }
    // Mongoose / MongoDB Duplicate Key Error (E11000)
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || error.keyPattern || {})[0] || 'field';
      const value = error.keyValue ? error.keyValue[field] : '';
      message = `Duplicate value entered for ${field}: "${value}". Resource already exists.`;
      errors = [`Duplicate key error on field: ${field}`];
    }
    // Mongoose CastError (Invalid ObjectId parameter)
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Resource not found. Invalid ${error.path}: ${error.value}`;
      errors = [`Invalid parameter format for ${error.path}`];
    }
    // JWT Expired Error
    else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Your authentication token has expired. Please log in again.';
      errors = ['Token expired'];
    }
    // JWT Malformed or Invalid Signature Error
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token. Authorization denied.';
      errors = ['Malformed or invalid token'];
    }
    // Express JSON Body Parser Syntax Error
    else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      statusCode = 400;
      message = 'Malformed JSON payload in request body.';
      errors = ['Invalid JSON syntax'];
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Log error based on severity
  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - Server Error ${error.statusCode}: ${error.message}`, {
      stack: error.stack,
      ip: req.ip,
      path: req.originalUrl,
      method: req.method
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - Client Error ${error.statusCode}: ${error.message}`);
  }

  // Form response body
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors && error.errors.length > 0 ? error.errors : [error.message]
  };

  // Attach stack trace only in development environment
  if (env.isDevelopment) {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
