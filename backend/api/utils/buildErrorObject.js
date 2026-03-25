const buildErrorObject = (statusCode, message) => {
  return {
    statusCode,
    message
  };
};

module.exports = buildErrorObject;
