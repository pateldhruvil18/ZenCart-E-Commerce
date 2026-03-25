const Address = require('../models/address.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

// GET /address
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    return buildResponse(res, 200, addresses);
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /address
const addAddress = async (req, res) => {
  try {
    const { isDefault, ...rest } = req.body;
    // If new address is default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.create({ user: req.user.id, ...rest, isDefault: !!isDefault });
    return buildResponse(res, 201, address, 'Address added');
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /address/:id
const updateAddress = async (req, res) => {
  try {
    const { isDefault, ...rest } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...rest, isDefault: !!isDefault },
      { new: true }
    );
    if (!address) return handleError(res, buildErrorObject(404, 'Address not found'));
    return buildResponse(res, 200, address, 'Address updated');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /address/:id
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!address) return handleError(res, buildErrorObject(404, 'Address not found'));
    return buildResponse(res, 200, null, 'Address deleted');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
