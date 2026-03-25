const jwt = require('jsonwebtoken');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

/**
 * Protect routes - requires valid JWT
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return handleError(res, buildErrorObject(401, 'Not authorized, no token'));
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return handleError(res, buildErrorObject(401, 'Not authorized, token invalid or expired'));
  }
};

/**
 * Admin only access
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return handleError(res, buildErrorObject(403, 'Access denied: Admins only'));
};

/**
 * Optional auth - attach user if token provided, skip if not
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (_) {
    // Ignore - continue as guest
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
