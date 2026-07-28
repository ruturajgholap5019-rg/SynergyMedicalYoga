const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Explore Shop',
  },
  buttonLink: {
    type: String,
    default: '/shop',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  page: {
    type: String,
    enum: ['home', 'services'],
    default: 'home',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Carousel', carouselSchema);
