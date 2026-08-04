const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const emailService = require('../services/emailService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { formSpamLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { contact } = require('../validators/schemas');

const router = express.Router();

// POST /api/contact - Submit contact form (Non-blocking response)
router.post('/', formSpamLimiter, validate(contact), catchAsync(async (req, res, next) => {
  const { name, phone, email, subject, message } = req.body;

  try {
    await ContactMessage.create({
      name,
      phone,
      email,
      subject: subject || 'General Inquiry / Consultation',
      message,
      recipientEmail: process.env.CONTACT_RECEIVER_EMAIL || '',
    });
  } catch (err) {
    console.error('Contact entry save error:', err.message);
  }

  const emailResult = await emailService.sendContactEmail({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
  });

  if (!emailResult?.success) {
    console.error('Contact email dispatch failed:', emailResult);
    return next(new AppError('Your enquiry was received, but the email notification could not be delivered. Please contact us directly.', 502));
  }

  res.status(201).json({
    status: 'success',
    message: 'Your inquiry message has been submitted successfully.',
    emailDelivery: emailResult?.simulated ? 'simulated' : 'sent',
  });
}));

module.exports = router;
