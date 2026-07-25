const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/Product');
const User = require('../models/User');
const Carousel = require('../models/Carousel');
const Service = require('../models/Service');
const Setting = require('../models/Setting');

const products = [
  {
    name: 'Knee Stabilizer Belts Sports Edition',
    category: 'Orthopaedic Belts',
    price: 1249,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 48,
    description: 'Designed specifically keeping in mind the overuse of knee joints during active sports.',
    features: ['Ergonomic Velcro adjustment straps', 'Breathable medical grade neoprene weave'],
    sizes: ['Small', 'Medium', 'Large'],
    images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Back Support Belt',
    category: 'Orthopaedic Belts',
    price: 999,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 21,
    description: 'Comfortable back support belt for posture and lumbar relief.',
    features: ['Adjustable compression', 'Breathable mesh fabric'],
    sizes: ['S', 'M', 'L'],
    images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Cervical Spine Traction Collar',
    category: 'Therapy Ropes & Kits',
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 34,
    description: 'Specialized cervical traction collar designed for alignment and neck pain alleviation.',
    features: ['Multi-level height adjustments', 'Soft washable cushion liner'],
    sizes: ['Universal'],
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
];

const carousels = [
  {
    title: 'Precision Spine & Joint Therapy Belts',
    subtitle: 'Doctor-designed orthopaedic belts and rope posture aligners for non-invasive recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'Explore Shop',
    buttonLink: '/shop',
    order: 1,
    isActive: true,
  },
  {
    title: 'Iyengar Medical Yoga Clinical Sessions',
    subtitle: 'Targeted muscular relief and guided therapeutic poses supervised by clinical experts.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'Book Therapy',
    buttonLink: '/services',
    order: 2,
    isActive: true,
  },
];

const services = [
  {
    title: 'Cervical & Lumbar Traction Therapy',
    category: 'Spine Therapy',
    description: 'Decompression of spinal discs using prop-assisted medical yoga alignments to relieve nerve pressure.',
    price: 1499,
    duration: '60 mins',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Knee & Joint Alignment Session',
    category: 'Joint Care',
    description: 'Customized rope and belt therapy to realign patellar position and eliminate osteoarthritic friction.',
    price: 1299,
    duration: '45 mins',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Postural Kyphosis Correction',
    category: 'Medical Yoga',
    description: 'Prop-supported chest openers and shoulder girdle stabilization for desk workers and elderly patients.',
    price: 1699,
    duration: '60 mins',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/synergy_yoga';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding');

    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully.');

    await Carousel.deleteMany();
    await Carousel.insertMany(carousels);
    console.log('✅ Carousels seeded successfully.');

    await Service.deleteMany();
    await Service.insertMany(services);
    console.log('✅ Services seeded successfully.');

    await Setting.deleteMany();
    await Setting.create({
      upiId: 'synergymedical@upi',
      merchantName: 'Synergy Medical Yoga',
      enableUpi: true,
      enableCod: true,
      enableStripe: true,
    });
    console.log('✅ Payment Gateway Settings initialized.');

    // Admin Account Reset
    const adminEmail = 'admin@synergy.com';
    await User.deleteMany({ email: adminEmail });

    const admin = new User({
      name: 'Synergy Admin',
      email: adminEmail,
      password: 'Admin@123456',
      phone: '+919876543210',
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Default Admin created/reset successfully: admin@synergy.com / Admin@123456');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
