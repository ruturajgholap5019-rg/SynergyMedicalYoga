const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const emailService = require('../services/emailService');
const crypto = require('crypto');

// Temporary in-memory OTP cache for pending registrations (10-min TTL)
const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) otpStore.delete(email);
  }
}, 60000);

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

// Send OTP / Verification Code for Sign Up
exports.sendOtp = catchAsync(async (req, res, next) => {
  const name = req.body.name ? req.body.name.trim() : '';
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const phone = req.body.phone ? req.body.phone.trim() : '';
  const password = req.body.password;

  if (!email || !name || !password) {
    return next(new AppError('Please fill in all required fields.', 400));
  }

  const existing = await User.findOne({ email });
  if (existing && !existing.isDeleted) return next(new AppError('Email is already registered.', 400));
  if (existing && existing.isDeleted) return next(new AppError('This account has been permanently deleted. Please contact support.', 403));

  // Generate 4-digit verification code matching frontend 4-box OTP input
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email, {
    otpHash: crypto.createHash('sha256').update(otpCode).digest('hex'),
    name,
    email,
    phone,
    password,
    expiresAt,
  });

  const emailRes = await emailService.sendOtpEmail({ email, name, otp: otpCode });
  if (!emailRes?.success) {
    otpStore.delete(email);
    return next(new AppError('Unable to send verification code. Please try again later.', 503));
  }

  res.status(200).json({
    status: 'success',
    message: `Verification code sent to ${email}`,
    emailDelivery: emailRes?.simulated ? 'simulated' : 'sent',
  });
});

// Verify OTP & Complete Registration
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const inputOtp = req.body.otp ? String(req.body.otp).trim() : '';

  const pendingData = otpStore.get(email);

  if (!pendingData) {
    return next(new AppError('Verification code expired or not found. Please request a new code.', 400));
  }

  if (Date.now() > pendingData.expiresAt) {
    otpStore.delete(email);
    return next(new AppError('Verification code has expired. Please request a new code.', 400));
  }

  const receivedHash = crypto.createHash('sha256').update(inputOtp).digest('hex');
  if (pendingData.otpHash !== receivedHash) {
    return next(new AppError('Invalid verification code. Please check your code and try again.', 400));
  }

  // OTP verified! Create user account now
  const user = await User.create({
    name: pendingData.name,
    email: pendingData.email,
    phone: pendingData.phone,
    password: pendingData.password,
    role: 'customer',
  });

  otpStore.delete(email);

  const tokenVersion = user.tokenVersion || 0;
  const accessToken = generateAccessToken(user._id, user.role, tokenVersion);
  const refreshToken = generateRefreshToken(user._id, user.role, tokenVersion);

  await RefreshToken.create({ token: refreshToken, user: user._id });
  setTokensCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: 'success',
    message: 'Account created successfully!',
    token: accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

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

  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (user.isDeleted) {
    return next(new AppError('This account has been permanently deleted. Please contact support.', 403));
  }

  if (!(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
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
  if (user.isDeleted) return next(new AppError('This account has been permanently deleted.', 401));
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

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.isProtected) {
    return next(new AppError('This account is protected and cannot be deleted.', 403));
  }
  if (user.role === 'admin') {
    return next(new AppError('Admin accounts cannot be deleted from the account portal.', 403));
  }

  user.isDeleted = true;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  await RefreshToken.updateMany({ user: user._id }, { revoked: true });
  clearTokensCookies(res);

  res.status(200).json({
    status: 'success',
    message: 'Your account has been permanently deleted.',
  });
});
