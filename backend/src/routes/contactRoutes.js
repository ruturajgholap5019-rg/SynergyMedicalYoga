const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const emailService = require('../services/emailService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// POST /api/contact - Submit contact form (Non-blocking response)
router.post('/', catchAsync(async (req, res, next) => {
  const { name, phone, email, subject, message } = req.body;

  if (!name || !phone || !email || !message) {
    return next(new AppError('Please provide all required fields: name, phone, email, and message.', 400));
  }

  const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ruturajgholap5019@gmail.com';

  // 1. Save message to MongoDB immediately
  const contactEntry = await ContactMessage.create({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
    recipientEmail,
  });

  // 2. Dispatch email notification asynchronously in background (Non-blocking)
  emailService.sendContactEmail({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
  }).then((result) => {
    console.log(`📧 Contact form email result for message ${contactEntry._id}:`, result);
  }).catch((err) => {
    console.error(`❌ Background Email Dispatch Error for ${contactEntry._id}:`, err.message);
  });

  // 3. Immediately respond with 201 Success so UI never hangs!
  res.status(201).json({
    status: 'success',
    message: 'Your inquiry message has been submitted successfully.',
    data: {
      id: contactEntry._id,
      recipientEmail,
    },
  });
}));

module.exports = router;
