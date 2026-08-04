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

const getEnvValue = (name) => {
  const aliases = {
    MONGO_URI: ['MONGO_URI', 'MONGODB_URI', 'MONGODB_URL'],
    ACCESS_TOKEN_SECRET: ['ACCESS_TOKEN_SECRET', 'JWT_SECRET', 'SECRET_KEY'],
    REFRESH_TOKEN_SECRET: ['REFRESH_TOKEN_SECRET', 'JWT_REFRESH_SECRET', 'JWT_SECRET'],
    ALLOWED_ORIGINS: ['ALLOWED_ORIGINS', 'CLIENT_URL'],
  };

  const keysToTry = aliases[name] || [name];
  for (const key of keysToTry) {
    const val = process.env[key];
    if (val && val.trim()) return val.trim();
  }
  return null;
};

const requireEnv = (name, { minLength = 1, productionOnly = false } = {}) => {
  const value = getEnvValue(name);
  const unsafe = !value || value.length < minLength || weakValues.has(value);
  if ((!productionOnly || isProduction) && unsafe) {
    console.warn(`⚠️ [CONFIG WARNING] Environment variable ${name} is missing or weak.`);
  }
  return value;
};

const validateEnv = () => {
  requireEnv('MONGO_URI', { productionOnly: true });
  requireEnv('ACCESS_TOKEN_SECRET', { minLength: 16, productionOnly: true });
  requireEnv('REFRESH_TOKEN_SECRET', { minLength: 16, productionOnly: true });
  requireEnv('ALLOWED_ORIGINS', { productionOnly: true });

  const access = getEnvValue('ACCESS_TOKEN_SECRET');
  const refresh = getEnvValue('REFRESH_TOKEN_SECRET');
  if (isProduction && access && refresh && access === refresh) {
    console.warn('⚠️ [CONFIG WARNING] ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET should be different in production.');
  }
};

const getJwtSecret = (name) => {
  const value = getEnvValue(name);
  if (value) return value;

  console.warn(`⚠️ [CONFIG WARNING] Missing required JWT secret (${name}). Using auto-generated fallback hash for production deployment stability.`);
  return crypto.createHash('sha256').update(`${name}:${process.env.RENDER_SERVICE_ID || 'fallback-synergy-2026'}`).digest('hex');
};

module.exports = {
  isProduction,
  validateEnv,
  getJwtSecret,
};

