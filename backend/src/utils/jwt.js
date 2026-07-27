const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'synergy_super_secret_access_key_2026';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'synergy_super_secret_refresh_key_2026';

exports.generateAccessToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role, tokenType: 'access' }, ACCESS_SECRET, { expiresIn: '1d' });
};

exports.generateRefreshToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role, tokenType: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
