const crypto = require('crypto');

const weakValues = new Set([
  'changeme',
  'change-me',
  'replace-me',
  'your-secret-here',
  'synergy_super_secret_access_key_2026',
  'synergy_super_secret_refresh_key_2026',
]);

const isProduction = process.env.NODE_ENV === 'production';

const requireEnv = (name, { minLength = 1, productionOnly = false } = {}) => {
  const value = process.env[name];
  const unsafe = !value || value.trim().length < minLength || weakValues.has(value.trim());
  if ((!productionOnly || isProduction) && unsafe) {
    throw new Error(`Missing or unsafe required environment variable: ${name}`);
  }
  return value;
};

const validateEnv = () => {
  requireEnv('MONGO_URI', { productionOnly: true });
  requireEnv('ACCESS_TOKEN_SECRET', { minLength: 32, productionOnly: true });
  requireEnv('REFRESH_TOKEN_SECRET', { minLength: 32, productionOnly: true });
  requireEnv('ALLOWED_ORIGINS', { productionOnly: true });

  if (isProduction && process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different in production.');
  }
};

const getJwtSecret = (name) => {
  const value = process.env[name];
  if (value && value.trim()) return value.trim();
  if (isProduction) throw new Error(`Missing required JWT secret: ${name}`);
  return crypto.createHash('sha256').update(`${name}:development-only`).digest('hex');
};

module.exports = {
  isProduction,
  validateEnv,
  getJwtSecret,
};
