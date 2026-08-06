const express = require('express');
const { login, sendOtp, verifyOtp, refresh, logout, getProfile, updateProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { auth } = require('../validators/schemas');

const router = express.Router();

router.post('/send-otp', authLimiter, validate(auth.register), sendOtp);
router.post('/verify-otp', authLimiter, validate(auth.verifyOtp), verifyOtp);
router.post('/login', authLimiter, validate(auth.login), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, updateProfile);
router.delete('/delete-account', protect, deleteAccount);
router.post('/delete-account', protect, deleteAccount);

module.exports = router;
