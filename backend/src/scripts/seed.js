const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: './.env' });

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
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
