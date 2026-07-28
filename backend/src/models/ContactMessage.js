const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    default: 'General Inquiry / Consultation',
  },
  message: {
    type: String,
    required: true,
  },
  recipientEmail: {
    type: String,
    default: 'ruturrajgholap5019@gmail.com',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
