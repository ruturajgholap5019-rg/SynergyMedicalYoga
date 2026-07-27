const express = require('express');
const Carousel = require('../models/Carousel');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Get active homepage carousels
router.get('/carousels', catchAsync(async (req, res) => {
  const carousels = await Carousel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ status: 'success', data: carousels });
}));

// Get active services
router.get('/services', catchAsync(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', data: services });
}));

// Get public payment gateway and dynamic website CMS settings
router.get('/settings', catchAsync(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({
    status: 'success',
    data: {
      // Payment & Checkout Config
      upiId: settings.upiId,
      merchantName: settings.merchantName,
      customQrUrl: settings.customQrUrl,
      enableUpi: settings.enableUpi,
      enableCod: settings.enableCod,
      enableStripe: settings.enableStripe,
      enableCashfree: settings.enableCashfree,
      cashfreeMode: settings.cashfreeMode,
      cashfreeAppId: settings.cashfreeAppId,

      // Dynamic CMS Stats
      statsCities: settings.statsCities ?? 15,
      statsCenters: settings.statsCenters ?? 200,
      statsTherapists: settings.statsTherapists ?? 400,
      statsClinics: settings.statsClinics ?? 35,

      // Hero & Tagline
      heroHeading: settings.heroHeading,
      heroSubheading: settings.heroSubheading,

      // About Us Content
      aboutCompanyText: settings.aboutCompanyText,
      synergyInitText: settings.synergyInitText,
      missionText: settings.missionText,
      visionText: settings.visionText,
      objectiveText: settings.objectiveText,

      // App Promo Banner
      appPromoHeading: settings.appPromoHeading,
      playStoreUrl: settings.playStoreUrl,
      appStoreUrl: settings.appStoreUrl,
      playStoreQrImage: settings.playStoreQrImage,
      appStoreQrImage: settings.appStoreQrImage,
      appMockupImage: settings.appMockupImage,

      // Contact & Socials
      contactPhone: settings.contactPhone,
      contactEmail: settings.contactEmail,
      contactAddress: settings.contactAddress,
      socialLinkedIn: settings.socialLinkedIn,
      socialInstagram: settings.socialInstagram,
      socialFacebook: settings.socialFacebook,
      socialYouTube: settings.socialYouTube,
    },
  });
}));

module.exports = router;
