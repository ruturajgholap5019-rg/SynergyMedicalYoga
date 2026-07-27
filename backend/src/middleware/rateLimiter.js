const rateLimit = require('express-rate-limit');

/**
 * 1. Auth & Credentials Limiter
 * Protects login and signup routes against brute-force password cracking and credential stuffing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Security alert: Too many authentication attempts from this IP address. Account access restricted for 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 2. Form Anti-Spam Limiter
 * Protects appointment bookings, contact messaging, and checkout endpoints from bot spams & flood attacks.
 */
const formSpamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6,
  message: 'Anti-Spam protection active: You have submitted too many forms in a short duration. Please wait before attempting again.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 3. General API Protection Limiter
 * Protects all general REST API endpoints from DDoS, scraper bots, and server overload.
 */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 150,
  message: 'Too many API requests received from your IP address. Please try again in 10 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  formSpamLimiter,
  apiLimiter,
};
