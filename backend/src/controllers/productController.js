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
  const identifier = req.params.id || '';
  let product = null;

  // 1. Check if identifier is a valid 24-character hex ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
    product = await Product.findById(identifier);
  }

  // 2. If not found by ObjectId or identifier is a URL slug, search by slug/name match
  if (!product && identifier) {
    const products = await Product.find();
    product = products.find((p) => {
      if (!p.name) return false;
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const paramSlug = identifier.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return slug === paramSlug || slug.includes(paramSlug) || paramSlug.includes(slug);
    });
  }

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: product,
  });
});

