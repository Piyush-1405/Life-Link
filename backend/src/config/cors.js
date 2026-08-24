/**
 * LifeLink - Blood Donation Management System
 * CORS (Cross-Origin Resource Sharing) Configuration
 */

const env = require('./env');
const ApiError = require('../utils/ApiError');

// Parse allowed origins from comma-separated string or single URL in env
const parseAllowedOrigins = (originConfig) => {
  if (!originConfig) return ['http://localhost:3000'];
  return originConfig
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow all if wildcard is specified or if the origin is in whitelist
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development mode, allow localhost on any port
    if (env.isDevelopment && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(403, `CORS policy violation: Origin '${origin}' is not allowed access.`)
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
  maxAge: 86400, // Preflight cache duration in seconds (24 hours)
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
