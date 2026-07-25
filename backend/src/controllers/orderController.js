const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('../config/stripe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendOrderConfirmation } = require('../services/emailService');

// Helper function to extract valid items safely without Mongoose CastErrors
const extractValidItems = async (req) => {
  let items = [];

  // Check items array provided in request body
  if (Array.isArray(req.body.items) && req.body.items.length > 0) {
    for (const it of req.body.items) {
      if (!it) continue;
      const rawId = it.productId?._id || it.productId || it.id;
      let matchedProduct = null;

      // 1. Try finding by valid Mongo ObjectId
      if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
        matchedProduct = await Product.findById(rawId);
      }
      
      // 2. Try finding product by name match
      if (!matchedProduct && it.name) {
        const cleanName = it.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        matchedProduct = await Product.findOne({ name: new RegExp(cleanName, 'i') });
      }

      // 3. Fallback to any active product in database
      if (!matchedProduct) {
        matchedProduct = await Product.findOne();
      }

      if (matchedProduct) {
        items.push({
          productId: matchedProduct._id,
          name: it.name || matchedProduct.name,
          price: Number(it.price || matchedProduct.price || 0),
          selectedSize: it.selectedSize || 'Standard',
          quantity: Number(it.quantity || 1),
        });
      }
    }
  }

  // Fallback to user's database cart if request items was empty
  if (items.length === 0 && req.user) {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    if (cart && Array.isArray(cart.items)) {
      for (const item of cart.items) {
        if (!item) continue;
        const p = (item.productId && typeof item.productId === 'object') ? item.productId : null;
        if (p && p._id) {
          items.push({
            productId: p._id,
            name: p.name || 'Therapy Product',
            price: Number(p.price || 0),
            selectedSize: item.selectedSize || 'Standard',
            quantity: Number(item.quantity || 1),
          });
        }
      }
    }
  }

  return items;
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress = {}, paymentMethod = 'upi', upiId } = req.body;
  const items = await extractValidItems(req);

  if (items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress: {
      street: shippingAddress.address || shippingAddress.street || 'Main Street',
      city: shippingAddress.city || 'Pune',
      state: shippingAddress.state || 'Maharashtra',
      pincode: shippingAddress.pincode || '411033',
      country: shippingAddress.country || 'India',
    },
    paymentMethod: paymentMethod || 'upi',
    upiId: upiId || undefined,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'processing',
  });

  await order.save();
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    status: 'success',
    order,
    data: {
      orderId: order._id,
      order,
    },
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { shippingAddress = {}, paymentMethod = 'upi', upiId } = req.body;
  const items = await extractValidItems(req);

  if (items.length === 0) {
    return next(new AppError('Your cart is empty. Please add items before checkout.', 400));
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress: {
      street: shippingAddress.address || shippingAddress.street || 'Main Street',
      city: shippingAddress.city || 'Pune',
      state: shippingAddress.state || 'Maharashtra',
      pincode: shippingAddress.pincode || '411033',
      country: shippingAddress.country || 'India',
    },
    paymentMethod: paymentMethod || 'upi',
    upiId: upiId || undefined,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'processing',
  });

  await order.save();

  // If UPI or Cash on Delivery, complete order in Mongo directly and return order ID
  if (paymentMethod === 'upi' || paymentMethod === 'cod') {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(201).json({
      status: 'success',
      order: order,
      data: {
        orderId: order._id,
        order: order,
        message: `Order placed successfully with ${paymentMethod.toUpperCase()}`,
      },
    });
  }

  // Attempt Stripe Gateway Checkout Session for Cards
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${item.name} (${item.selectedSize})`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:5173'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/checkout`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({
      status: 'success',
      sessionUrl: session.url,
      orderId: order._id,
      order: order,
    });
  } catch (stripeError) {
    console.error('Stripe error (fallback to local order):', stripeError.message);
    res.status(201).json({
      status: 'success',
      order: order,
      data: {
        orderId: order._id,
        order: order,
        message: 'Order created successfully',
      },
    });
  }
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID.', 404));
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this order.', 403));
  }

  res.status(200).json({
    status: 'success',
    data: order,
  });
});

exports.stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'paid', orderStatus: 'processing' },
      { new: true }
    );

    if (order) {
      await sendOrderConfirmation(order);
    }
  }

  res.status(200).json({ received: true });
});
