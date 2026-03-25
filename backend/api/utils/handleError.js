const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  console.error(`[handleError] ${statusCode}: ${message}`);
  return res.status(statusCode).json({ success: false, message });
};

module.exports = handleError;
