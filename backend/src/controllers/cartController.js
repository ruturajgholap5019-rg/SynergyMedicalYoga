const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const sanitizeCart = (cart) => {
  if (cart && Array.isArray(cart.items)) {
    cart.items = cart.items.filter((item) => item && item.productId);
  }
  return cart;
};

exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  } else {
    cart = sanitizeCart(cart);
  }
  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, selectedSize, quantity = 1 } = req.body;
  if (!productId) {
    return next(new AppError('Product ID is required.', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  cart = sanitizeCart(cart);

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId && item.productId.toString() === productId.toString() && item.selectedSize === selectedSize
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId: product._id, selectedSize, quantity });
  }

  await cart.save();
  await cart.populate('items.productId');
  cart = sanitizeCart(cart);

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, selectedSize, quantity } = req.body;
  if (!productId) {
    return next(new AppError('Product ID is required.', 400));
  }

  if (quantity < 0) {
    return next(new AppError('Quantity cannot be negative.', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found.', 404));
  }

  cart = sanitizeCart(cart);

  const itemIndex = cart.items.findIndex(
    (item) => item.productId && item.productId.toString() === productId.toString() && item.selectedSize === selectedSize
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
  cart = sanitizeCart(cart);

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId, selectedSize } = req.body;
  if (!productId) {
    return next(new AppError('Product ID is required.', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found.', 404));
  }

  cart = sanitizeCart(cart);

  const itemIndex = cart.items.findIndex(
    (item) => item.productId && item.productId.toString() === productId.toString() && item.selectedSize === selectedSize
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart.', 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate('items.productId');
  cart = sanitizeCart(cart);

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

  cart = sanitizeCart(cart);

  for (const gItem of guestItems) {
    const pId = gItem.productId || gItem.id;
    if (!pId) continue;

    // Verify product exists in database before merging
    const productExists = await Product.findById(pId);
    if (!productExists) continue;

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === pId.toString() && item.selectedSize === gItem.selectedSize
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += (gItem.quantity || 1);
    } else {
      cart.items.push({
        productId: productExists._id,
        selectedSize: gItem.selectedSize || 'Standard',
        quantity: gItem.quantity || 1,
      });
    }
  }

  await cart.save();
  await cart.populate('items.productId');
  cart = sanitizeCart(cart);

  res.status(200).json({
    status: 'success',
    data: cart,
  });
});
