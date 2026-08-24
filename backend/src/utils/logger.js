/**
 * LifeLink - Blood Donation Management System
 * Application Logger (Winston)
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const env = require('../config/env');

const logsDirectory = path.resolve(__dirname, '../../logs');

// Ensure log directory exists in production
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
  const outputMessage = stack || message;
  return `${timestamp} [${level}]: ${outputMessage}${metaString}`;
});

// Configure Winston Transports
const transports = [
  new winston.transports.Console({
    level: env.isDevelopment ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      consoleFormat
    )
  })
];

// In production, persist error logs and combined logs to disk
if (env.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDirectory, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, 'combined.log'),
      level: 'info',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    })
  );
}

const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
  exitOnError: false
});

module.exports = logger;
