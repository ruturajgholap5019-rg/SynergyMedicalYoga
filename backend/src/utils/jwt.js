const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/env');

const ACCESS_SECRET = getJwtSecret('ACCESS_TOKEN_SECRET');
const REFRESH_SECRET = getJwtSecret('REFRESH_TOKEN_SECRET');

exports.generateAccessToken = (userId, role = 'user', tokenVersion = 0) => {
  return jwt.sign({ id: userId, role, tokenVersion, tokenType: 'access' }, ACCESS_SECRET, { expiresIn: '1d' });
};

exports.generateRefreshToken = (userId, role = 'user', tokenVersion = 0) => {
  return jwt.sign({ id: userId, role, tokenVersion, tokenType: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};
