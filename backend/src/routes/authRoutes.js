const express = require('express');
const { register, login, refresh, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { auth } = require('../validators/schemas');

const router = express.Router();

router.post('/register', authLimiter, validate(auth.register), register);
router.post('/login', authLimiter, validate(auth.login), login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

module.exports = router;
