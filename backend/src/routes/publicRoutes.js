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

// Get public payment gateway settings (UPI ID & Scanner config)
router.get('/settings', catchAsync(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({
    status: 'success',
    data: {
      upiId: settings.upiId,
      merchantName: settings.merchantName,
      customQrUrl: settings.customQrUrl,
      enableUpi: settings.enableUpi,
      enableCod: settings.enableCod,
      enableStripe: settings.enableStripe,
    },
  });
}));

module.exports = router;
