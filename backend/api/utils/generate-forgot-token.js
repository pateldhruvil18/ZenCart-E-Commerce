const crypto = require('crypto');

const generateForgotToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expiry };
};

module.exports = generateForgotToken;
