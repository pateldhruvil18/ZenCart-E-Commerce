const buildResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({ success: true, message, data });
};

module.exports = buildResponse;
