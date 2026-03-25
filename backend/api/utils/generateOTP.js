/**
 * Generates a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Returns expiry time 10 minutes from now
 */
const otpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

module.exports = { generateOTP, otpExpiry };
