const express = require('express');
const { register, login, refresh, logout, getProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { auth } = require('../validators/schemas');

const router = express.Router();

router.post('/register', authLimiter, validate(auth.register), register);
router.post('/login', authLimiter, validate(auth.login), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.delete('/delete-account', protect, deleteAccount);
router.post('/delete-account', protect, deleteAccount);

module.exports = router;
