const Order = require('../models/Order');
const Cart = require('../models/Cart');
const stripe = require('../config/stripe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendOrderConfirmation } = require('../services/emailService');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod = 'stripe' } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    selectedSize: item.selectedSize || 'Standard',
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  let clientSecret = null;

  if (paymentMethod === 'stripe') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'inr',
      metadata: { orderId: order._id.toString() },
    });
    order.stripePaymentIntentId = paymentIntent.id;
    clientSecret = paymentIntent.client_secret;
  }

  await order.save();

  if (paymentMethod === 'cod') {
    await Cart.findOneAndDelete({ user: req.user._id });
  }

  res.status(201).json({
    status: 'success',
    data: {
      order,
      clientSecret,
    },
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { shippingAddress = {}, paymentMethod = 'stripe' } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    selectedSize: item.selectedSize || 'Standard',
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user._id,
    items,
    totalAmount,
    shippingAddress: {
      street: shippingAddress.address || shippingAddress.street || '',
      city: shippingAddress.city || 'Pune',
      state: shippingAddress.state || 'Maharashtra',
      pincode: shippingAddress.pincode || '',
      country: shippingAddress.country || 'India',
    },
    paymentMethod: 'stripe',
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'upi'],
    line_items: items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?payment=success`,
    cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?payment=cancel`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      url: session.url,
      orderId: order._id,
    },
  });
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
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    return next(new AppError('Order not found or you do not have access.', 404));
  }
  res.status(200).json({
    status: 'success',
    data: order,
  });
});

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      await order.save();
      await Cart.findOneAndDelete({ user: order.user });
      try {
        await sendOrderConfirmation(order);
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr);
      }
    }
  }

  res.json({ received: true });
};
