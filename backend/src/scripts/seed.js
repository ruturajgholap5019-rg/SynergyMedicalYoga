const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const Product = require('../models/Product');
const User = require('../models/User');
const Carousel = require('../models/Carousel');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const Order = require('../models/Order');
const Appointment = require('../models/Appointment');

const products = [
  {
    name: 'Knee Stabilizer Belts Sports Edition',
    category: 'Orthopaedic Belts',
    price: 1249,
    originalPrice: 1599,
    rating: 4.9,
    reviewsCount: 48,
    description: 'Designed specifically keeping in mind the overuse of knee joints during active sports and osteoarthritis recovery.',
    features: ['Ergonomic Velcro adjustment straps', 'Breathable medical grade neoprene weave', 'Dual side flex stabilizers'],
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    images: ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Ergonomic Lumbar Back Support Belt',
    category: 'Orthopaedic Belts',
    price: 999,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 32,
    description: 'Comfortable back support belt engineered for posture correction and lumbar spinal decompression.',
    features: ['Double-pull compression mechanism', 'Breathable mesh fabric', 'Removable lumbar pad'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Cervical Spine Traction Collar',
    category: 'Relief Kits',
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 54,
    description: 'Specialized cervical traction collar designed for cervical vertebrae alignment and neck strain alleviation.',
    features: ['Multi-level height adjustments', 'Soft washable cushion liner', 'Hypoallergenic material'],
    sizes: ['Universal'],
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Medical Yoga Wall Rope & Pelvic Sling Kit',
    category: 'Relief Kits',
    price: 2499,
    originalPrice: 2999,
    rating: 4.95,
    reviewsCount: 61,
    description: 'Clinical grade Iyengar yoga wall rope system with heavy-duty anchors and padded pelvic sling for spinal traction.',
    features: ['High tensile strength cotton ropes', 'Stainless steel wall anchors', 'Padded pelvic sling harness'],
    sizes: ['Standard Kit'],
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Postural Thoracic Kyphosis Corrector',
    category: 'Orthopaedic Belts',
    price: 1199,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 29,
    description: 'Discreet upper back posture brace designed for desk workers to prevent slouching and rounded shoulders.',
    features: ['Under-clothing low-profile fit', 'Breathable elastic straps', 'Soft underarm padding'],
    sizes: ['Small', 'Medium', 'Large'],
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Sciatica Relief Leg & Sacroiliac Belt',
    category: 'Orthopaedic Belts',
    price: 1349,
    originalPrice: 1699,
    rating: 4.85,
    reviewsCount: 42,
    description: 'Targeted compression belt designed to stabilize the sacroiliac joint and ease nerve pain radiates down the leg.',
    features: ['Anti-slip silicone grips', 'Targeted SI joint compression', 'Lightweight moisture-wicking material'],
    sizes: ['M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Spinal Decompression Home Prop Kit',
    category: 'Wellness Kits',
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewsCount: 78,
    description: 'Complete therapeutic prop kit including posture bolsters, lumbar arches, stretch belts, and video guidance manual.',
    features: ['High density EVA foam arch', 'Organic cotton bolster pillow', 'Includes Mobile App exercise subscription'],
    sizes: ['Complete Kit'],
    images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
  {
    name: 'Iyengar Medical Yoga Block & Strap Set',
    category: 'Wellness Kits',
    price: 899,
    originalPrice: 1199,
    rating: 4.75,
    reviewsCount: 39,
    description: 'Eco-friendly solid pine wooden yoga block paired with an 8-foot non-slip metal D-ring alignment strap.',
    features: ['Beveled edges for comfort', '100% natural pine wood', 'Heavy-duty 8ft cotton strap'],
    sizes: ['Standard'],
    images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
  },
];

const carousels = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'Explore Shop',
    buttonLink: '/shop',
    page: 'home',
    order: 1,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'Book Therapy',
    buttonLink: '/services',
    page: 'home',
    order: 2,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80',
    buttonText: 'Find Centers',
    buttonLink: '/find-centres',
    page: 'home',
    order: 3,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Book Consultation',
    buttonLink: '/services',
    page: 'services',
    order: 1,
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Explore Programs',
    buttonLink: '/services',
    page: 'services',
    order: 2,
    isActive: true,
  },
];

const services = [
  {
    title: 'Cervical & Lumbar Traction Therapy',
    category: 'Spine Therapy',
    description: 'Decompression of spinal discs using prop-assisted medical yoga alignments to relieve nerve pressure and chronic pain.',
    price: 1499,
    duration: '60 mins',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Knee & Joint Alignment Session',
    category: 'Joint Care',
    description: 'Customized rope and belt therapy to realign patellar position and eliminate osteoarthritic friction in knee joints.',
    price: 1299,
    duration: '45 mins',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Postural Kyphosis Correction',
    category: 'Medical Yoga',
    description: 'Prop-supported chest openers and shoulder girdle stabilization for desk workers and elderly patients suffering from slouching.',
    price: 1699,
    duration: '60 mins',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Sciatica & Sacroiliac Joint Decompression',
    category: 'Spine Therapy',
    description: 'Targeted pelvic alignment poses assisted by wall ropes to reduce piriformis tightness and sciatic nerve compression.',
    price: 1599,
    duration: '60 mins',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Iyengar Rope-Assisted Intensive Traction',
    category: 'Medical Yoga',
    description: 'Advanced 75-minute gravity-assisted inverted traction therapy conducted in specialized rope halls for complete spinal lengthening.',
    price: 1899,
    duration: '75 mins',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    title: 'Senior Citizen Gentle Joint Mobility',
    category: 'Joint Care',
    description: 'Gentle chair and belt-assisted flexibility therapy customized for geriatric joint health and arthritis pain management.',
    price: 1199,
    duration: '45 mins',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/synergy_yoga';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding');

    // 1. Clear Products
    await Product.deleteMany();
    console.log('✅ All Products cleared (Catalog ready for your custom entries).');

    // 2. Clear Carousels
    await Carousel.deleteMany();
    console.log('✅ All Carousels cleared (Sliders ready for your custom upload).');

    // 3. Clear Services
    await Service.deleteMany();
    console.log('✅ All Services cleared (Clinical therapies ready for custom entries).');

    // 4. Seed Payment Gateway Settings
    await Setting.deleteMany();
    await Setting.create({
      upiId: 'synergymedical@upi',
      merchantName: 'Synergy Medical Yoga',
      enableUpi: true,
      enableCod: true,
      enableStripe: true,
    });
    console.log('✅ Payment Gateway Settings initialized.');

    // 5. Seed Users (Admin & Customers) - RE-ADDED AND KEPT AS REQUESTED!
    await User.deleteMany();
    
    const admin = await User.create({
      name: 'Synergy Admin',
      email: 'admin@synergy.com',
      password: 'Admin@123456',
      phone: '+919876543210',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: 'User@123456',
      phone: '+919822012345',
      role: 'customer',
    });

    const user2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: 'User@123456',
      phone: '+919822023456',
      role: 'customer',
    });

    const user3 = await User.create({
      name: 'Aniket Deshmukh',
      email: 'aniket.d@example.com',
      password: 'User@123456',
      phone: '+919822034567',
      role: 'customer',
    });

    const user4 = await User.create({
      name: 'Sneha Kulkarni',
      email: 'sneha.k@example.com',
      password: 'User@123456',
      phone: '+919822045678',
      role: 'customer',
    });

    console.log('✅ Default Admin & 4 Customer accounts added successfully.');

    // 6. Clear Orders and Appointments
    await Order.deleteMany();
    await Appointment.deleteMany();
    console.log('✅ Orders and appointments cleared for a completely authentic start.');

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Default Admin Account: admin@synergy.com / Admin@123456');
    console.log('Sample Customer Accounts: rahul.sharma@example.com / User@123456');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
