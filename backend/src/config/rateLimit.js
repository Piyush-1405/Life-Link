/**
 * LifeLink - Blood Donation Management System
 * Rate Limiting Configuration
 */

const rateLimit = require('express-rate-limit');

/**
 * Standard custom response handler for rate limit exceeded events
 */
const createRateLimitHandler = (customMessage) => (req, res, _next, options) => {
  res.status(options.statusCode).json({
    success: false,
    statusCode: options.statusCode,
    message: customMessage || 'Too many requests from this IP, please try again later.',
    errors: ['Rate limit exceeded. Please try again after the specified cooldown period.']
  });
};

/**
 * General API rate limiter: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
  handler: createRateLimitHandler('Too many requests from this IP, please try again after 15 minutes.')
});

/**
 * Strict authentication rate limiter: 10 requests per 15 minutes per IP
 * Protects login, registration, password reset, and OTP endpoints against brute-force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per `windowMs`
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  statusCode: 429,
  handler: createRateLimitHandler('Too many authentication attempts from this IP, please try again after 15 minutes.')
});

module.exports = {
  generalLimiter,
  authLimiter
};
