const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
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
