const { validationResult } = require('express-validator');
const buildErrorObject = require('./buildErrorObject');

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => buildErrorObject(422, err.msg))
    });
  }
  next();
};
