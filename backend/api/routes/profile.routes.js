const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/', getProfile);
router.patch('/', updateProfile);

module.exports = router;
