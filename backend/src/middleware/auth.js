const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to access this.', 401));
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = user;
  next();
});
