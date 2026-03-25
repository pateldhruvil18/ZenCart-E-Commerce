const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['guest', 'user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    // OTP-based email verification
    otp: { type: String },
    otpExpiry: { type: Date },
    // Token-based password reset
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// Rapid Lookup Profile Indexing
userSchema.index({ email: 1 });
userSchema.index({ isVerified: 1 });

module.exports = mongoose.model('User', userSchema);
