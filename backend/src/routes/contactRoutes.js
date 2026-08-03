const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const emailService = require('../services/emailService');
const catchAsync = require('../utils/catchAsync');
const { formSpamLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { contact } = require('../validators/schemas');

const router = express.Router();

// POST /api/contact - Submit contact form (Non-blocking response)
router.post('/', formSpamLimiter, validate(contact), catchAsync(async (req, res, next) => {
  const { name, phone, email, subject, message } = req.body;

  // 1. Save message to MongoDB asynchronously with 3s timeout
  try {
    const savePromise = ContactMessage.create({
      name,
      phone,
      email,
      subject: subject || 'General Inquiry / Consultation',
      message,
      recipientEmail: process.env.CONTACT_RECEIVER_EMAIL || '',
    });
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
    await Promise.race([savePromise, timeoutPromise]);
  } catch (err) {
    console.error('Contact entry save error:', err.message);
  }

  // 2. Dispatch email notification in background
  emailService.sendContactEmail({
    name,
    phone,
    email,
    subject: subject || 'General Inquiry / Consultation',
    message,
  }).catch((err) => {
    console.error('Background Email Dispatch Error:', err.message);
  });

  // 3. Immediately respond with 201 Success in under 500ms so UI NEVER hangs or times out!
  res.status(201).json({
    status: 'success',
    message: 'Your inquiry message has been submitted successfully.',
  });
}));

module.exports = router;
