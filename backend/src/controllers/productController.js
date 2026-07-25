const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: product,
  });
});
