require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { LEGACY_ADMIN_EMAIL } = require('../config/legacyAdmin');

const strongPassword = (password) => {
  return (
    typeof password === 'string' &&
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const rotateLegacyAdmin = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL;
  const newEmail = String(process.env.LEGACY_ADMIN_NEW_EMAIL || '').toLowerCase().trim();
  const newPassword = process.env.LEGACY_ADMIN_NEW_PASSWORD;
  const newName = process.env.LEGACY_ADMIN_NEW_NAME || 'Synergy Admin';

  if (!mongoUri) {
    throw new Error('MONGO_URI is required.');
  }

  if (!newEmail || !newPassword) {
    throw new Error('LEGACY_ADMIN_NEW_EMAIL and LEGACY_ADMIN_NEW_PASSWORD are required.');
  }

  if (newEmail === LEGACY_ADMIN_EMAIL) {
    throw new Error('LEGACY_ADMIN_NEW_EMAIL must not be admin@synergy.com.');
  }

  if (!strongPassword(newPassword)) {
    throw new Error('LEGACY_ADMIN_NEW_PASSWORD must be at least 12 characters and include uppercase, lowercase, number, and symbol.');
  }

  await mongoose.connect(mongoUri);

  const legacyAdmin = await User.findOne({ email: LEGACY_ADMIN_EMAIL }).select('+password');
  if (legacyAdmin) {
    legacyAdmin.email = newEmail;
    legacyAdmin.password = newPassword;
    legacyAdmin.name = newName;
    legacyAdmin.role = 'admin';
    await legacyAdmin.save();
    await RefreshToken.updateMany({ user: legacyAdmin._id }, { revoked: true });
    console.log(`Legacy admin rotated to: ${newEmail}`);
  } else {
    await User.create({
      name: newName,
      email: newEmail,
      password: newPassword,
      role: 'admin',
    });
    console.log(`Legacy admin was not found. New admin created: ${newEmail}`);
  }

  await mongoose.disconnect();
};

rotateLegacyAdmin().catch(async (err) => {
  console.error(err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
