const Order = require('../models/Order');
const Cart = require('../models/Cart');
const stripe = require('../config/stripe');
const { isStripeConfigured } = require('../config/stripe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendOrderConfirmation } = require('../services/emailService');

const buildOrderFromCart = (cart, userId, shippingAddress, paymentMethod) => {
  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.productId.price,
    selectedSize: item.selectedSize || 'Standard',
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    user: userId,
    items,
    totalAmount,
    shippingAddress: {
      name: shippingAddress.name || '',
      phone: shippingAddress.phone || '',
      email: shippingAddress.email || '',
      street: shippingAddress.address || shippingAddress.street || '',
      city: shippingAddress.city || 'Pune',
      state: shippingAddress.state || 'Maharashtra',
      pincode: shippingAddress.pincode || '',
      country: shippingAddress.country || 'India',
    },
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'processing',
  };
};

const markOrderPaid = async (order) => {
  if (order.paymentStatus === 'paid') {
    return order;
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'processing';
  await order.save();
  await Cart.findOneAndDelete({ user: order.user });

  try {
    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    if (populatedOrder?.user?.email) {
      await sendOrderConfirmation(populatedOrder);
    }
  } catch (emailErr) {
    console.error('Email sending failed:', emailErr.message);
  }

  return order;
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress = {}, paymentMethod = 'cod' } = req.body;

  if (!['stripe', 'cod'].includes(paymentMethod)) {
    return next(new AppError('Invalid payment method.', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  const orderData = buildOrderFromCart(cart, req.user._id, {
    ...shippingAddress,
    name: shippingAddress.name || req.user.name,
    email: shippingAddress.email || req.user.email,
    phone: shippingAddress.phone || req.user.phone,
  }, paymentMethod);

  if (paymentMethod === 'stripe') {
    if (!isStripeConfigured() || !stripe) {
      return next(new AppError('Online payments are not configured. Please use Cash on Delivery or contact support.', 503));
    }

    const order = await Order.create(orderData);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'inr',
      metadata: { orderId: order._id.toString() },
      receipt_email: order.shippingAddress.email || req.user.email,
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    return res.status(201).json({
      status: 'success',
      data: {
        order,
        clientSecret: paymentIntent.client_secret,
      },
    });
  }

  const order = await Order.create({
    ...orderData,
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    status: 'success',
    data: {
      order,
      message: 'Cash on Delivery order placed successfully.',
    },
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { shippingAddress = {} } = req.body;

  if (!isStripeConfigured() || !stripe) {
    return next(new AppError('Online payments are not configured. Add STRIPE_SECRET_KEY to backend/.env or choose Cash on Delivery.', 503));
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty.', 400));
  }

  const orderData = buildOrderFromCart(cart, req.user._id, {
    ...shippingAddress,
    name: shippingAddress.name || req.user.name,
    email: shippingAddress.email || req.user.email,
    phone: shippingAddress.phone || req.user.phone,
  }, 'stripe');

  const order = await Order.create(orderData);

  const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          description: item.selectedSize ? `Size: ${item.selectedSize}` : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    customer_email: order.shippingAddress.email || req.user.email,
    success_url: `${clientBaseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientBaseUrl}/?payment=cancel&order_id=${order._id}`,
    metadata: {
      orderId: order._id.toString(),
      userId: req.user._id.toString(),
    },
    shipping_address_collection: {
      allowed_countries: ['IN'],
    },
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      url: session.url,
      sessionId: session.id,
      orderId: order._id,
    },
  });
});

exports.verifyCheckoutSession = catchAsync(async (req, res, next) => {
  const { session_id: sessionId } = req.query;

  if (!sessionId) {
    return next(new AppError('Missing session_id.', 400));
  }

  if (!isStripeConfigured() || !stripe) {
    return next(new AppError('Online payments are not configured.', 503));
  }

  const order = await Order.findOne({ stripeSessionId: sessionId, user: req.user._id });
  if (!order) {
    return next(new AppError('Order not found for this payment session.', 404));
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === 'paid') {
    await markOrderPaid(order);
  } else if (session.payment_status === 'unpaid' && session.status === 'expired') {
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    await order.save();
  }

  const updatedOrder = await Order.findById(order._id);

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
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

  if (!isStripeConfigured() || !stripe) {
    return res.status(503).send('Stripe is not configured');
  }

  if (!endpointSecret || endpointSecret === 'whsec_dummy') {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not configured. Webhook ignored.');
    return res.status(200).json({ received: true, warning: 'webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('⚠️ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.payment_status === 'paid') {
        const order = await Order.findOne({ stripeSessionId: session.id });
        if (order) {
          await markOrderPaid(order);
        }
      }
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        await order.save();
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order) {
        await markOrderPaid(order);
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        await order.save();
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }

  res.json({ received: true });
};
