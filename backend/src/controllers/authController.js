const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../utils/resend');
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

// Generate a secure 4-digit numeric OTP
function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// ─── STEP 1: Send OTP ──────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// Validates the email, hashes the password, stores pending data + OTP, sends email.
exports.sendOtp = catchAsync(async (req, res, next) => {
  const name = req.body.name ? req.body.name.trim() : '';
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const phone = req.body.phone ? req.body.phone.trim() : '';
  const password = req.body.password;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required.', 400));
  }

  // Check if email is already taken by an active account
  const existing = await User.findOne({ email });
  if (existing && !existing.isDeleted) {
    return next(new AppError('Email already registered.', 400));
  }
  if (existing && existing.isDeleted) {
    return next(new AppError('This account has been permanently deleted. Please contact support.', 403));
  }

  // Hash password now so we don't store plaintext in the OTP document
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOtp();

  // Remove any previous OTP for this email and create a fresh one
  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    otp,
    pendingData: { name, phone, password: hashedPassword },
  });

  // Send email via Resend
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    // Clean up the OTP record if the email fails
    await Otp.deleteMany({ email });
    return next(new AppError('Failed to send verification email. Please try again.', 500));
  }

  res.status(200).json({
    status: 'success',
    message: `A 4-digit verification code has been sent to ${email}. It expires in 10 minutes.`,
  });
});

// ─── STEP 2: Verify OTP & Complete Registration ────────────────────────────────
// POST /api/auth/verify-otp
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const email = req.body.email ? req.body.email.toLowerCase().trim() : '';
  const otp = String(req.body.otp || '').trim();

  if (!email || !otp) {
    return next(new AppError('Email and OTP are required.', 400));
  }

  const record = await Otp.findOne({ email });

  if (!record) {
    return next(new AppError('OTP expired or not found. Please request a new code.', 400));
  }

  // Allow max 5 wrong attempts before invalidating the OTP
  if (record.attempts >= 5) {
    await Otp.deleteMany({ email });
    return next(new AppError('Too many incorrect attempts. Please request a new code.', 400));
  }

  if (record.otp !== otp) {
    record.attempts += 1;
    await record.save();
    const remaining = 5 - record.attempts;
    return next(new AppError(`Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`, 400));
  }

  // OTP is correct — create the user account using the stored (already-hashed) password
  const { name, phone, password: hashedPassword } = record.pendingData;

  // Double-check the email is still free (race condition guard)
  const existingUser = await User.findOne({ email });
  if (existingUser && !existingUser.isDeleted) {
    await Otp.deleteMany({ email });
    return next(new AppError('Email already registered.', 400));
  }

  // Create user — bypass the pre-save hash since we already hashed the password
  const user = new User({ name, email, phone, role: 'customer' });
  user.password = hashedPassword; // set raw so pre-save hook is skipped via markModified trick
  user.$locals = user.$locals || {};
  // Skip the bcrypt pre-save hook since password is already hashed
  user.skipHashPassword = true;
  await user.save({ validateBeforeSave: true });

  // Clean up OTP record
  await Otp.deleteMany({ email });

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

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
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

// ─── REFRESH TOKEN ─────────────────────────────────────────────────────────────
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

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
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

// ─── GET PROFILE ───────────────────────────────────────────────────────────────
exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});
