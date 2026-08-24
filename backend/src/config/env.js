/**
 * LifeLink - Blood Donation Management System
 * Environment Configuration and Validation
 */

const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

// Load environment variables from .env file located at root of backend project
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Also fallback to default root .env if not found
dotenv.config();

// Define validation schema for environment variables
const envSchema = Joi.object({
  PORT: Joi.number().port().default(5000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  MONGODB_URI: Joi.string()
    .required()
    .messages({
      'any.required': 'MONGODB_URI is a required environment variable'
    }),
  JWT_SECRET: Joi.string()
    .required()
    .messages({
      'any.required': 'JWT_SECRET is a required environment variable'
    }),
  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .messages({
      'any.required': 'JWT_REFRESH_SECRET is a required environment variable'
    }),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  GOOGLE_MAPS_API_KEY: Joi.string().allow('').optional().default('')
}).unknown(true);

const { error, value: validatedEnv } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true
});

if (error) {
  const errorDetails = error.details.map((detail) => detail.message).join('; ');
  throw new Error(`Config validation error: ${errorDetails}`);
}

const env = Object.freeze({
  PORT: validatedEnv.PORT,
  NODE_ENV: validatedEnv.NODE_ENV,
  MONGODB_URI: validatedEnv.MONGODB_URI,
  JWT_SECRET: validatedEnv.JWT_SECRET,
  JWT_REFRESH_SECRET: validatedEnv.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: validatedEnv.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: validatedEnv.JWT_REFRESH_EXPIRY,
  CORS_ORIGIN: validatedEnv.CORS_ORIGIN,
  GOOGLE_MAPS_API_KEY: validatedEnv.GOOGLE_MAPS_API_KEY,
  isDevelopment: validatedEnv.NODE_ENV === 'development',
  isProduction: validatedEnv.NODE_ENV === 'production',
  isTest: validatedEnv.NODE_ENV === 'test'
});

module.exports = env;
