const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
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

exports.createProduct = catchAsync(async (req, res, next) => {
  const productData = { ...req.body, createdBy: req.user._id };
  const product = await Product.create(productData);
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
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;
  if (!orderStatus) return next(new AppError('Order status is required.', 400));

  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, {
    new: true,
    runValidators: true,
  });
  if (!order) return next(new AppError('Order not found.', 404));

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    },
  });
});
