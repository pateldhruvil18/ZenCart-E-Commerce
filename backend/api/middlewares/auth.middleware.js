const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

/**
 * Protect routes - requires valid JWT
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return handleError(res, buildErrorObject(401, 'Not authorized, no token'));
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Live DB check: ensure account is still active (catches blocked users with valid tokens)
    const user = await User.findById(decoded.id).select('status').lean();
    if (!user) {
      return handleError(res, buildErrorObject(401, 'User no longer exists'));
    }
    if (user.status === 'blocked') {
      return handleError(res, buildErrorObject(403, 'Your account has been blocked by the administrator. Please contact support.'));
    }

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
