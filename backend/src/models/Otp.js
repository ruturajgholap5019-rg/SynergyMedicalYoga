const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // Stores the pending registration data so we don't need to re-send it
  pendingData: {
    name: String,
    phone: String,
    password: String, // already hashed by the time it's stored
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: MongoDB auto-removes OTP documents after 10 minutes
    expires: 600,
  },
});

module.exports = mongoose.model('Otp', otpSchema);
