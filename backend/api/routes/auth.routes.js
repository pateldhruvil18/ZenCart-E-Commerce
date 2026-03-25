const express = require('express');
const router = express.Router();
const { register, verifyOTP, resendOTP, login, forgotPassword, resetPassword, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const v = require('../validators/auth.validator');
const { validateRequest } = require('../utils/validateRequest');

router.post('/register',        v.register,        validateRequest, register);
router.post('/verify-otp',      v.verifyOTP,       validateRequest, verifyOTP);
router.post('/resend-otp',      v.resendOTP,       validateRequest, resendOTP);
router.post('/login',           v.login,           validateRequest, login);
router.post('/forgot-password', v.forgotPassword,  validateRequest, forgotPassword);
router.post('/reset-password',  v.resetPassword,   validateRequest, resetPassword);
router.post('/change-password', protect, v.changePassword, validateRequest, changePassword);

module.exports = router;
