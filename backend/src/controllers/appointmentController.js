const Appointment = require('../models/Appointment');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createAppointment = catchAsync(async (req, res, next) => {
  const {
    patientName,
    patientPhone,
    patientEmail,
    serviceId,
    serviceTitle,
    fee,
    appointmentDate,
    timeSlot,
    center,
    notes,
  } = req.body;

  if (!patientName || !patientPhone || !patientEmail || !serviceTitle || !appointmentDate || !timeSlot) {
    return next(new AppError('Please provide all required appointment fields.', 400));
  }

  const appointment = await Appointment.create({
    user: req.user ? req.user._id : undefined,
    patientName,
    patientPhone,
    patientEmail,
    service: serviceId || undefined,
    serviceTitle,
    fee: fee || 0,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    center: center || 'Greens Center, Chinchwad, Pune',
    notes,
    status: 'pending',
    paymentStatus: 'pending',
  });

  res.status(201).json({
    status: 'success',
    data: appointment,
  });
});

exports.getMyAppointments = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You must be logged in to view your appointments.', 401));
  }

  const appointments = await Appointment.find({
    $or: [{ user: req.user._id }, { patientEmail: req.user.email }],
  }).sort({ appointmentDate: -1 });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: appointments,
  });
});
