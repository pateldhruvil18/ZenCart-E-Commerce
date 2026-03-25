let winston;
try {
  winston = require('winston');
} catch (e) {
  // winston not installed, fallback to console
}
const { createLogger, format, transports } = winston || {};

// Simple logger using console if winston not available
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  debug: (msg) => process.env.NODE_ENV !== 'production' && console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`),
};

module.exports = logger;
