const rateLimit = require('express-rate-limit');
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

/**
 * 1. Auth & Credentials Limiter
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: () => isServerless,
  message: 'Security alert: Too many authentication attempts. Please wait 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 2. Form Anti-Spam Limiter
 */
const formSpamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: () => isServerless,
  message: 'Anti-Spam protection active: Please wait before submitting another inquiry.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 3. General API Protection Limiter
 */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  skip: () => isServerless,
  message: 'Too many API requests received. Please try again in 10 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  formSpamLimiter,
  apiLimiter,
};
