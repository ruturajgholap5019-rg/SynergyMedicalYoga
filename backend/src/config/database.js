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

    // Automatically seed initial carousels directly into MongoDB Atlas if collection is empty
    try {
      const Carousel = require('../models/Carousel');
      const count = await Carousel.countDocuments();
      if (count === 0) {
        await Carousel.insertMany([
          {
            imageUrl: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
            title: 'Guided Training Videos\nfor Therapeutic Exercises\nat Home',
            subtitle: 'Clinical medical yoga alignments for knee, spine, and neck strain rehabilitation.',
            buttonText: 'Explore Shop',
            buttonLink: '/shop',
            page: 'home',
            order: 1,
            isActive: true,
          },
          {
            imageUrl: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
            title: 'Professional Rope & Belt\nTherapy for Pain Management',
            subtitle: 'Doctor supervised posture realignment & joint friction elimination.',
            buttonText: 'Book Therapy',
            buttonLink: '/services',
            page: 'home',
            order: 2,
            isActive: true,
          },
          {
            imageUrl: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',
            title: 'Evidence-Based\nTherapy Programs\nfor Faster Recovery',
            subtitle: 'Integrated approach to pain relief with certified therapeutic instructors.',
            buttonText: 'Find Centers',
            buttonLink: '/find-centres',
            page: 'home',
            order: 3,
            isActive: true,
          },
          {
            imageUrl: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
            title: 'Cervical & Lumbar Traction Therapy',
            buttonText: 'Book Consultation',
            buttonLink: '/services',
            page: 'services',
            order: 1,
            isActive: true,
          },
          {
            imageUrl: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
            title: 'Clinical Medical Yoga & Rehabilitation',
            buttonText: 'Explore Programs',
            buttonLink: '/services',
            page: 'services',
            order: 2,
            isActive: true,
          },
        ]);
        console.log('✅ Initial dynamic carousels automatically seeded into MongoDB Atlas');
      }
    } catch (carouselErr) {
      console.error('Carousel auto-seed notice:', carouselErr.message);
    }
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
