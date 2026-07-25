const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      // Access token expired, attempt fallback to refresh token
    }
  }

  // Fallback check using refresh token if available
  if (refreshToken) {
    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);
      const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
      if (storedToken) {
        const user = await User.findById(decodedRefresh.id).select('-password');
        if (user) {
          const newAccessToken = generateAccessToken(user._id);
          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
          });
          req.user = user;
          return next();
        }
      }
    } catch (refreshErr) {
      // Invalid refresh token
    }
  }

  return next(new AppError('You are not logged in. Please log in to access this page.', 401));
});
