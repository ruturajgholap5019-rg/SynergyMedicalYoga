require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

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

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Synergy Admin';
  const phone = process.env.SEED_ADMIN_PHONE || '';
  const mongoUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    'mongodb://127.0.0.1:27017/synergy_yoga';

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.');
  }

  if (!strongPassword(password)) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters and include uppercase, lowercase, number, and symbol.');
  }

  await mongoose.connect(mongoUri);

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Updated existing user to admin: ${existing.email}`);
    } else {
      console.log(`Admin already exists: ${existing.email}`);
    }
  } else {
    await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone,
      role: 'admin',
    });
    console.log(`Admin created: ${email.toLowerCase().trim()}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch(async (err) => {
  console.error(err.message);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
