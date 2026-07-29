const express = require('express');
const { sendOtp, verifyOtp, login, refresh, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { auth } = require('../validators/schemas');

const router = express.Router();

// OTP-based registration (2 steps)
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);

// Standard auth
router.post('/login', authLimiter, validate(auth.login), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);

module.exports = router;
