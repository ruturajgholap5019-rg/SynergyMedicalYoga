const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const sanitizeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.tokenVersion;
  return safeUser;
};

const accessCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.accessToken;

  // Support dual-channel authentication: inspect Authorization Bearer header if cookie is absent
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password +tokenVersion');
      if (user) {
        if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
          return next(new AppError('Session expired. Please log in again.', 401));
        }
        req.user = sanitizeUser(user);
        return next();
      }
    } catch (err) {
      // Access token expired or invalid signature, fall back to valid refresh session
    }
  }

  // Fallback check using secure refresh token session if available
  if (refreshToken) {
    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
      if (storedToken) {
        const user = await User.findById(decodedRefresh.id).select('-password +tokenVersion');
        if (user) {
          if ((decodedRefresh.tokenVersion || 0) !== (user.tokenVersion || 0)) {
            await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
            return next(new AppError('Session expired. Please log in again.', 401));
          }
          const newAccessToken = generateAccessToken(user._id, user.role, user.tokenVersion || 0);
          res.cookie('accessToken', newAccessToken, accessCookieOptions());
          req.user = sanitizeUser(user);
          return next();
        }
      }
    } catch (refreshErr) {
      // Refresh token expired or malformed
    }
  }

  return next(new AppError('Unauthorized: Please log in with valid security credentials to access this protected route.', 401));
});
