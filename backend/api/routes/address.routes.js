const express = require('express');
const router = express.Router();
const { getAddresses, addAddress, updateAddress, deleteAddress } = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', getAddresses);
router.post('/', addAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
