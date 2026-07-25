const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  upiId: {
    type: String,
    default: 'synergymedical@upi',
    trim: true,
  },
  merchantName: {
    type: String,
    default: 'Synergy Medical Yoga',
    trim: true,
  },
  customQrUrl: {
    type: String,
    default: '',
  },
  enableUpi: {
    type: Boolean,
    default: true,
  },
  enableCod: {
    type: Boolean,
    default: true,
  },
  enableStripe: {
    type: Boolean,
    default: true,
  },
  cashfreeAppId: {
    type: String,
    default: '',
    trim: true,
  },
  cashfreeSecretKey: {
    type: String,
    default: '',
    trim: true,
  },
  cashfreeMode: {
    type: String,
    enum: ['SANDBOX', 'PRODUCTION'],
    default: 'SANDBOX',
  },
  enableCashfree: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Setting', settingSchema);
