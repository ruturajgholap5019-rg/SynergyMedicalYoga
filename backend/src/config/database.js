const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/synergy_yoga';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed default Admin account if missing in production MongoDB Atlas
    try {
      const User = require('../models/User');
      const adminEmail = 'admin@synergy.com';
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await User.create({
          name: 'Synergy Admin',
          email: adminEmail,
          password: 'Admin@123456',
          phone: '+919876543210',
          role: 'admin',
        });
        console.log(`✅ Default Admin account automatically seeded (${adminEmail})`);
      } else if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      }
    } catch (seedErr) {
      console.error('Admin auto-bootstrap notice:', seedErr.message);
    }
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
