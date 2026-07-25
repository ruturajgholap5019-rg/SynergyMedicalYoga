const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, selectedSize, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId && item.selectedSize === selectedSize
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, selectedSize, quantity });
  }

  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, selectedSize, quantity } = req.body;

  if (quantity < 0) {
    return next(new AppError('Quantity cannot be negative.', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found.', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId && item.selectedSize === selectedSize
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart.', 404));
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId, selectedSize } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found.', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId && item.selectedSize === selectedSize
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart.', 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.mergeCart = catchAsync(async (req, res, next) => {
  const { guestItems } = req.body;

  if (!guestItems || !Array.isArray(guestItems)) {
    return next(new AppError('Guest items must be an array.', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  for (const gItem of guestItems) {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === gItem.productId && item.selectedSize === gItem.selectedSize
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += gItem.quantity;
    } else {
      cart.items.push(gItem);
    }
  }

  await cart.save();
  await cart.populate('items.productId');

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
