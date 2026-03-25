const bcrypt = require('bcrypt');
const path = require('path');
const ejs = require('ejs');
const User = require('../models/user.schema');
const Cart = require('../models/cart.schema');
const Wishlist = require('../models/wishlist.schema');
const generateTokens = require('../utils/generateTokens');
const generateForgotToken = require('../utils/generate-forgot-token');
const { generateOTP, otpExpiry } = require('../utils/generateOTP');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');  
const handleError = require('../utils/handleError');
const sendMail = require('../helpers/sendMail');

const templatePath = (name) => path.join(__dirname, '../templates', name);


// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return handleError(res, buildErrorObject(400, 'Name, email and password are required'));
    }

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) {
      return handleError(res, buildErrorObject(409, 'An account with this email already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiry = otpExpiry();

    // Upsert: update if unverified account exists (resend OTP), create if new
    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp, otpExpiry: expiry },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const html = await ejs.renderFile(templatePath('otp-verification.ejs'), { name, otp });
    await sendMail(
      email,
      'Your OTP - E-Commerce Store Email Verification',
      html
    );

    return buildResponse(res, 201,
      { id: user._id, email: user.email },
      'Registration successful. An OTP has been sent to your email. Please verify to continue.'
    );
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp, sessionId } = req.body;
    if (!email || !otp) {
      return handleError(res, buildErrorObject(400, 'Email and OTP are required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return handleError(res, buildErrorObject(404, 'User not found'));
    }
    if (user.isVerified) {
      return buildResponse(res, 200, null, 'Email is already verified. Please login.');
    }
    if (!user.otp || user.otp !== otp) {
      return handleError(res, buildErrorObject(400, 'Invalid OTP'));
    }
    if (user.otpExpiry < new Date()) {
      return handleError(res, buildErrorObject(400, 'OTP has expired. Please request a new one.'));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Merge guest data
    if (sessionId) {
      await mergeGuestCart(sessionId, user._id.toString());
      await mergeGuestWishlist(sessionId, user._id.toString());
    }

    const { accessToken } = generateTokens(user._id, user.role);
    return buildResponse(res, 200, {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Email verified successfully! You are now logged in.');
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return handleError(res, buildErrorObject(404, 'User not found'));
    if (user.isVerified) return buildResponse(res, 200, null, 'Email already verified.');

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = otpExpiry();
    await user.save();

    const html = await ejs.renderFile(templatePath('otp-verification.ejs'), { name: user.name, otp });
    await sendMail(email, 'Resend OTP - E-Commerce Store', html);
    return buildResponse(res, 200, null, 'A new OTP has been sent to your email.');
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password, sessionId } = req.body;
    if (!email || !password) {
      return handleError(res, buildErrorObject(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user) return handleError(res, buildErrorObject(401, 'Invalid credentials'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return handleError(res, buildErrorObject(401, 'Invalid credentials'));

    if (!user.isVerified) {
      return handleError(res, buildErrorObject(403, 'Please verify your email. Check your inbox for the OTP.'));
    }

    // Merge guest data
    if (sessionId) {
      await mergeGuestCart(sessionId, user._id.toString());
      await mergeGuestWishlist(sessionId, user._id.toString());
    }

    const { accessToken } = generateTokens(user._id, user.role);
    return buildResponse(res, 200, {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    }, 'Login successful');
  } catch (err) {
    return handleError(res, err);
  }
};

// Cart merge helper
const mergeGuestCart = async (sessionId, userId) => {
  const guestCart = await Cart.findOne({ sessionId }).populate('items.product');
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await Cart.findOne({ userId });
  if (!userCart) userCart = new Cart({ userId, items: [] });

  for (const guestItem of guestCart.items) {
    const idx = userCart.items.findIndex(
      (i) => i.product.toString() === guestItem.product._id.toString()
    );
    if (idx >= 0) {
      userCart.items[idx].quantity += guestItem.quantity;
    } else {
      userCart.items.push({ product: guestItem.product._id, quantity: guestItem.quantity, price: guestItem.price });
    }
  }
  await userCart.save();
  await Cart.deleteOne({ sessionId });
};

// Wishlist merge helper
const mergeGuestWishlist = async (sessionId, userId) => {
  const guestWishlist = await Wishlist.findOne({ sessionId });
  if (!guestWishlist || guestWishlist.products.length === 0) return;

  let userWishlist = await Wishlist.findOne({ user: userId });
  if (!userWishlist) {
    userWishlist = new Wishlist({ user: userId, products: [] });
  }

  for (const prodId of guestWishlist.products) {
    if (!userWishlist.products.includes(prodId)) {
      userWishlist.products.push(prodId);
    }
  }
  await userWishlist.save();
  await Wishlist.deleteOne({ sessionId });
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return buildResponse(res, 200, null, 'If that email exists, a reset OTP has been sent.');

    const otp = generateOTP();
    user.resetPasswordToken = otp;
    user.resetPasswordExpiry = otpExpiry();
    await user.save();

    const html = await ejs.renderFile(templatePath('forgot-password.ejs'), { otp });
    await sendMail(email, 'Password Reset OTP - E-Commerce Store', html);
    return buildResponse(res, 200, null, 'If that email exists, a reset OTP has been sent.');
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return handleError(res, buildErrorObject(400, 'Email, OTP and new password are required'));
    }
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpiry: { $gt: new Date() },
    });
    if (!user) return handleError(res, buildErrorObject(400, 'Invalid or expired OTP'));
    user.password = await bcrypt.hash(password, 10);
    user.isVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    return buildResponse(res, 200, null, 'Password reset successful. You can now login.');
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /auth/change-password (protected)
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return handleError(res, buildErrorObject(400, 'Old and new passwords are required'));
    }
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return handleError(res, buildErrorObject(400, 'Old password is incorrect'));
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return buildResponse(res, 200, null, 'Password changed successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { register, verifyOTP, resendOTP, verifyEmail: verifyOTP, login, forgotPassword, resetPassword, changePassword };
