const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Carousel = require('../models/Carousel');
const Service = require('../models/Service');
const Setting = require('../models/Setting');
const Appointment = require('../models/Appointment');
const ContactMessage = require('../models/ContactMessage');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinary');

// --- USER CRUD ---
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new AppError('User not found.', 404));
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered.', 400));
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'customer',
  });

  res.status(201).json({
    status: 'success',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, phone, role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) return next(new AppError('User not found.', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

// --- PRODUCT CRUD ---
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: product,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new AppError('Product not found.', 404));

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('Product not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});

// --- ORDER MANAGEMENT ---
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus, paymentStatus } = req.body;
  const updateData = {};
  if (orderStatus) updateData.orderStatus = orderStatus;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!order) return next(new AppError('Order not found.', 404));

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new AppError('Order not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'Order deleted successfully',
  });
});

// --- CAROUSEL CRUD ---
exports.getAllCarousels = catchAsync(async (req, res, next) => {
  const carousels = await Carousel.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: carousels.length,
    data: carousels,
  });
});

exports.createCarousel = catchAsync(async (req, res, next) => {
  const carousel = await Carousel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: carousel,
  });
});

exports.updateCarousel = catchAsync(async (req, res, next) => {
  const carousel = await Carousel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!carousel) return next(new AppError('Carousel slide not found.', 404));

  res.status(200).json({
    status: 'success',
    data: carousel,
  });
});

exports.deleteCarousel = catchAsync(async (req, res, next) => {
  const carousel = await Carousel.findByIdAndDelete(req.params.id);
  if (!carousel) return next(new AppError('Carousel slide not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'Carousel slide deleted successfully',
  });
});

// --- SERVICES CRUD ---
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: services.length,
    data: services,
  });
});

exports.createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);
  res.status(201).json({
    status: 'success',
    data: service,
  });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return next(new AppError('Service not found.', 404));

  res.status(200).json({
    status: 'success',
    data: service,
  });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return next(new AppError('Service not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'Service deleted successfully',
  });
});

// --- PAYMENT SETTINGS (UPI ID & SCANNER) ---
exports.getPaymentSettings = catchAsync(async (req, res, next) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({
    status: 'success',
    data: settings,
  });
});

exports.updatePaymentSettings = catchAsync(async (req, res, next) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    settings = await Setting.findByIdAndUpdate(
      settings._id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    status: 'success',
    data: settings,
  });
});

// --- APPOINTMENTS MANAGEMENT ---
exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate('service', 'title category duration price')
    .sort({ appointmentDate: -1, createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: appointments,
  });
});

exports.updateAppointmentStatus = catchAsync(async (req, res, next) => {
  const { status, paymentStatus, notes } = req.body;
  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (notes) updateData.notes = notes;

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!appointment) return next(new AppError('Appointment not found.', 404));

  res.status(200).json({
    status: 'success',
    data: appointment,
  });
});

exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return next(new AppError('Appointment not found.', 404));

  res.status(200).json({
    status: 'success',
    message: 'Appointment deleted successfully',
  });
});

// --- DASHBOARD METRICS ---
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalCarousels = await Carousel.countDocuments();
  const totalServices = await Service.countDocuments();
  const totalAppointments = await Appointment.countDocuments();

  const paidOrders = await Order.find({ paymentStatus: 'paid' });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCarousels,
      totalServices,
      totalAppointments,
      totalRevenue,
    },
  });
});

// --- IMAGE UPLOADS (MULTER + CLOUDINARY) ---
exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided for upload.', 400));
  }

  let imageUrl;
  // If Cloudinary environment variables are configured, upload to Cloudinary for permanent HTTPS storage
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      imageUrl = await uploadToCloudinary(req.file);
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cloudinaryErr) {
      console.error('Cloudinary upload warning:', cloudinaryErr.message);
    }
  }

  // Fallback to local server static URL if Cloudinary is unconfigured or fails
  if (!imageUrl) {
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  }

  res.status(200).json({
    status: 'success',
    url: imageUrl,
    filename: req.file.filename,
  });
});

exports.uploadImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('No image files provided for upload.', 400));
  }

  const urls = [];
  for (const file of req.files) {
    let url;
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        url = await uploadToCloudinary(file);
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (cloudinaryErr) {
        console.error('Cloudinary upload warning:', cloudinaryErr.message);
      }
    }
    if (!url) {
      const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      url = `${baseUrl}/uploads/${file.filename}`;
    }
    urls.push(url);
  }

  res.status(200).json({
    status: 'success',
    urls: urls,
    filenames: req.files.map((file) => file.filename),
  });
});

// --- CONTACT MESSAGES MANAGEMENT ---
exports.getAllContactMessages = catchAsync(async (req, res, next) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: messages,
  });
});

exports.deleteContactMessage = catchAsync(async (req, res, next) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return next(new AppError('No contact message found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

