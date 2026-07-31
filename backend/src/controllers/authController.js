const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
});

const setTokensCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days persistent session
  });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days persistent session
  });
};

const clearTokensCookies = (res) => {
  res.clearCookie('accessToken', cookieOptions());
  res.clearCookie('refreshToken', cookieOptions());
};

exports.register = catchAsync(async (req, res, next) => {
  const name = req.body.name ? req.body.name.trim() : '';
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const phone = req.body.phone ? req.body.phone.trim() : '';
  const password = req.body.password;

  const existing = await User.findOne({ email });
  if (existing && !existing.isDeleted) return next(new AppError('Email already registered.', 400));
  if (existing && existing.isDeleted) return next(new AppError('This account has been permanently deleted. Please contact support.', 403));

  const user = await User.create({ name, email, phone, password, role: 'customer' });
  const tokenVersion = user.tokenVersion || 0;
  const accessToken = generateAccessToken(user._id, user.role, tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.role, tokenVersion);

  await RefreshToken.create({ token: refreshToken, user: user._id });
  setTokensCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: 'success',
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const password = req.body.password;

  const user = await User.findOne({ email }).select('+password +tokenVersion');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (user.isDeleted) {
    return next(new AppError('This account has been permanently deleted. Please contact support.', 403));
  }

  const tokenVersion = user.tokenVersion || 0;
  const accessToken = generateAccessToken(user._id, user.role, tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.role, tokenVersion);

  await RefreshToken.create({ token: refreshToken, user: user._id });
  setTokensCookies(res, accessToken, refreshToken);

  res.status(200).json({
    status: 'success',
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

exports.refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next(new AppError('No refresh token provided.', 401));

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    return next(new AppError('Invalid refresh token.', 401));
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
  if (!storedToken) return next(new AppError('Refresh token invalid or revoked.', 401));

  const user = await User.findById(decoded.id).select('+tokenVersion');
  if (!user) return next(new AppError('User not found.', 401));
  if ((decoded.tokenVersion || 0) !== (user.tokenVersion || 0)) {
    return next(new AppError('Session expired. Please log in again.', 401));
  }

  const newAccessToken = generateAccessToken(user._id, user.role, user.tokenVersion || 0);
  res.cookie('accessToken', newAccessToken, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ status: 'success', token: newAccessToken, message: 'Access token refreshed' });
});

exports.logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  let userId = req.user?._id;
  const accessToken = req.cookies.accessToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

  if (!userId && accessToken) {
    try {
      userId = verifyAccessToken(accessToken).id;
    } catch {}
  }
  if (!userId && refreshToken) {
    try {
      userId = verifyRefreshToken(refreshToken).id;
    } catch {}
  }

  if (refreshToken) {
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
  }
  if (userId) {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    await RefreshToken.updateMany({ user: userId }, { revoked: true });
  }

  clearTokensCookies(res);
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});
