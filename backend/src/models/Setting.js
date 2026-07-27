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

  /* ── Dynamic Website CMS & Content Fields ── */
  // Statistical Counters
  statsCities: {
    type: Number,
    default: 15,
  },
  statsCenters: {
    type: Number,
    default: 200,
  },
  statsTherapists: {
    type: Number,
    default: 400,
  },
  statsClinics: {
    type: Number,
    default: 35,
  },

  // Hero & Tagline Content
  heroHeading: {
    type: String,
    default: 'Guided Training Videos for Therapeutic Exercises at Home',
  },
  heroSubheading: {
    type: String,
    default: 'Doctor Supervised Non-Surgical Rehabilitation & Rope and Belt Therapy',
  },

  // About Us Content
  aboutCompanyText: {
    type: String,
    default: 'iMediYog Healthcare LLP is a Pune-based healthcare company with a vision to become a comprehensive Therapy Care Hub, making quality therapy education and services accessible through an integrated ecosystem of certified professionals, technology, and innovative healthcare solutions across multiple therapy disciplines.',
  },
  synergyInitText: {
    type: String,
    default: 'Synergy Medical Yoga is one of iMediYog Healthcare LLP’s flagship initiatives dedicated to democratizing Rope & Belt Therapy for the prevention and conservative management of knee, back, and neck pain. Through certified education programs, clinically designed therapy products, and a technology platform connecting people with certified Rope & Belt Therapy practitioners, Synergy Medical Yoga is making this specialized therapy more accessible across India.',
  },
  missionText: {
    type: String,
    default: 'To establish Medical Yoga Therapy as the preferred first-line treatment for individuals managing knee, back, and neck pain.',
  },
  visionText: {
    type: String,
    default: 'To minimize the need for surgeries by effectively managing degenerative musculoskeletal diseases and injuries of the knee, back, neck, and shoulder.',
  },
  objectiveText: {
    type: String,
    default: 'To empower every household in India with at least one person trained in Medical Yoga Therapy.',
  },

  // Mobile App Download Promotional Content
  appPromoHeading: {
    type: String,
    default: 'Download Our App\nto Book an Appoiment',
  },
  playStoreUrl: {
    type: String,
    default: 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
  },
  appStoreUrl: {
    type: String,
    default: 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
  },
  playStoreQrImage: {
    type: String,
    default: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-03-at-8.34.11-PM.jpeg',
  },
  appStoreQrImage: {
    type: String,
    default: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-1.34.20-PM-1024x1024.jpeg',
  },
  appMockupImage: {
    type: String,
    default: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',
  },

  // Contact Information & Social Links
  contactPhone: {
    type: String,
    default: '+91 98230 45678',
  },
  contactEmail: {
    type: String,
    default: 'contact@synergymedicalyoga.com',
  },
  contactAddress: {
    type: String,
    default: 'Pune, Maharashtra, India',
  },
  socialLinkedIn: {
    type: String,
    default: 'https://www.linkedin.com/company/synergy-medical-yoga',
  },
  socialInstagram: {
    type: String,
    default: 'https://www.instagram.com',
  },
  socialFacebook: {
    type: String,
    default: 'https://www.facebook.com',
  },
  socialYouTube: {
    type: String,
    default: 'https://www.youtube.com',
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Setting', settingSchema);

