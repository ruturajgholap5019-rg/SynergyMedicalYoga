const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true,
  },
  patientEmail: {
    type: String,
    required: true,
    trim: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  serviceTitle: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  center: {
    type: String,
    default: 'Greens Center, Chinchwad, Pune',
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

appointmentSchema.index({ user: 1, appointmentDate: -1 });
appointmentSchema.index({ patientEmail: 1, appointmentDate: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
