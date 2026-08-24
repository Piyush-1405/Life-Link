/**
 * LifeLink - Blood Donation Management System
 * Async Handler Utility
 *
 * Wraps asynchronous Express route handlers and middleware to ensure
 * all thrown errors and rejected promises are forwarded to the Express
 * error-handling middleware via next(err).
 *
 * @param {Function} requestHandler - Async function (req, res, next)
 * @returns {import('express').RequestHandler}
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
