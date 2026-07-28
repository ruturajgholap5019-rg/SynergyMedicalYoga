const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const emailService = require('../services/emailService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', catchAsync(async (req, res, next) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !email || !message) {
    return next(new AppError('Please provide all required fields: name, phone, email, and message.', 400));
  }

  const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ruturrajgholap5019@gmail.com';

  // 1. Save message to MongoDB
  const contactEntry = await ContactMessage.create({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
    recipientEmail,
  });

  // 2. Dispatch email notification to ruturrajgholap5019@gmail.com
  const emailResult = await emailService.sendContactEmail({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
  });

  res.status(201).json({
    status: 'success',
    message: 'Your inquiry message has been submitted successfully.',
    data: {
      id: contactEntry._id,
      recipientEmail,
      emailSent: emailResult.success,
    },
  });
}));

module.exports = router;
