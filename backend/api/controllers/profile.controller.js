const User = require('../models/user.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

// GET /profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationToken -resetPasswordToken');
    if (!user) return handleError(res, buildErrorObject(404, 'User not found'));
    return buildResponse(res, 200, user);
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password -verificationToken -resetPasswordToken');
    return buildResponse(res, 200, user, 'Profile updated successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getProfile, updateProfile };
