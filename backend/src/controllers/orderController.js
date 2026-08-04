const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('../config/stripe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendOrderConfirmation } = require('../services/emailService');
const notificationService = require('../services/notificationService');

// Checkout data is never trusted: products, prices, names and available sizes
// are read from the catalogue, not supplied by the browser.
const extractValidItems = async (req) => {
  let sourceItems = Array.isArray(req.body.items) ? req.body.items : [];

  // Fallback to user's database cart if request items was empty
  if (sourceItems.length === 0 && req.user) {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    if (cart && Array.isArray(cart.items)) {
      sourceItems = cart.items.map((item) => ({ productId: item.productId?._id || item.productId, selectedSize: item.selectedSize, quantity: item.quantity }));
    }
  }
  if (!sourceItems.length || sourceItems.length > 50) return [];
  const ids = sourceItems.map((item) => item?.productId?._id || item?.productId || item?.id);
  if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) return [];
  const products = await Product.find({ _id: { $in: ids }, inStock: true });
  const productsById = new Map(products.map((product) => [String(product._id), product]));
  return sourceItems.map((item) => {
    const product = productsById.get(String(item.productId?._id || item.productId || item.id));
    const quantity = Number(item.quantity);
    const selectedSize = String(item.selectedSize || 'Standard');
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || !product.sizes.includes(selectedSize)) return null;
    return { productId: product._id, name: product.name, price: product.price, selectedSize, quantity };
  }).filter(Boolean);
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
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  await order.save();
  await Cart.findOneAndDelete({ user: req.user._id });

  notificationService.sendOrderNotification({
    orderId: order._id,
    customerName: req.user.name,
    phone: req.user.phone,
    email: req.user.email,
    totalAmount,
    paymentMethod: paymentMethod || 'upi',
  }).catch((err) => {
    console.error('Background order notification error:', err.message);
  });

  res.status(201).json({
    status: 'success',
    order,
    data: {
      orderId: order._id,
      order,
    },
  });
});

const cashfreeService = require('../services/cashfreeService');

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  if (process.env.PAYMENTS_ENABLED !== 'true') {
    return next(new AppError('Online payments are temporarily unavailable.', 503));
  }
  const { shippingAddress = {}, paymentMethod = 'cashfree', upiId, customerInfo } = req.body;
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
    paymentMethod: paymentMethod || 'cashfree',
    upiId: upiId || undefined,
    paymentStatus: ['cod', 'cashfree', 'stripe'].includes(paymentMethod) ? 'pending' : 'paid',
    orderStatus: 'processing',
  });

  await order.save();

  // 1. Handle Cashfree Payments (Primary Gateway)
  if (paymentMethod === 'cashfree') {
    try {
      const clientUrl = process.env.CLIENT_URL || req.headers.origin;
      if (!clientUrl || !process.env.BACKEND_URL) {
        return next(new AppError('Payment redirect URLs are not configured.', 503));
      }
      const returnUrl = `${clientUrl}/order-success?order_id={order_id}&session_id={order_token}`;
      const notifyUrl = `${process.env.BACKEND_URL}/api/orders/cashfree-webhook`;

      const cfSession = await cashfreeService.createCashfreeOrderSession({
        orderId: order._id.toString(),
        amount: totalAmount,
        customerInfo: {
          id: req.user._id.toString(),
          name: customerInfo?.name || req.user.name,
          email: customerInfo?.email || req.user.email,
          phone: customerInfo?.phone || req.user.phone,
        },
        returnUrl,
        notifyUrl,
      });

      order.cashfreeOrderId = cfSession.cashfreeOrderId;
      await order.save();
      await Cart.findOneAndDelete({ user: req.user._id });

      return res.status(200).json({
        status: 'success',
        paymentSessionId: cfSession.paymentSessionId,
        cashfreeOrderId: cfSession.cashfreeOrderId,
        orderId: order._id,
        order,
      });
    } catch (cfError) {
      console.error('Cashfree PG error (fallback to local order):', cfError.message);
      await Cart.findOneAndDelete({ user: req.user._id });
      return res.status(201).json({
        status: 'success',
        order,
        data: {
          orderId: order._id,
          order,
          message: 'Order created with pending payment',
        },
      });
    }
  }

  // 2. Handle Manual UPI or Cash on Delivery
  if (paymentMethod === 'upi' || paymentMethod === 'cod') {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(201).json({
      status: 'success',
      order: order,
      data: {
        orderId: order._id,
        order: order,
        message: `Order received with ${paymentMethod.toUpperCase()} and pending confirmation.`,
      },
    });
  }

  // 3. Attempt Stripe Gateway Checkout Session for Cards
  if (!stripe) {
    return next(new AppError('Payment integration is under review. Please contact Synergy Medical Yoga to confirm this order.', 503));
  }

  try {
    const clientUrl = process.env.CLIENT_URL || req.headers.origin;
    if (!clientUrl) {
      return next(new AppError('Payment redirect URL is not configured.', 503));
    }

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
      success_url: `${clientUrl}/order-success?order_id=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      sessionUrl: session.url,
      orderId: order._id,
      order: order,
    });
  } catch (stripeError) {
    console.error('Stripe Checkout Error:', stripeError.message);
    return next(new AppError(`Stripe Payment Failed: ${stripeError.message}. Please check STRIPE_SECRET_KEY in backend .env`, 400));
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

exports.cashfreeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);

  // Validate HMAC SHA256 Signature
  const isValid = await cashfreeService.verifyCashfreeSignature(rawBody, signature, timestamp);
  if (!isValid) {
    return res.status(401).json({ status: 'fail', message: 'Invalid webhook signature.' });
  }

  const payload = JSON.parse(rawBody);
  const eventType = payload?.type;
  const orderData = payload?.data?.order;
  const paymentData = payload?.data?.payment;

  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentData?.payment_status === 'SUCCESS') {
    const cfOrderId = orderData?.order_id || payload?.data?.order_id;
    if (cfOrderId) {
      const parts = cfOrderId.split('_');
      const mongoOrderId = parts[1];

      if (mongoOrderId && mongoose.Types.ObjectId.isValid(mongoOrderId)) {
        const order = await Order.findOneAndUpdate(
          { _id: mongoOrderId, paymentStatus: { $ne: 'paid' } },
          {
            paymentStatus: 'paid',
            orderStatus: 'processing',
            cashfreePaymentId: paymentData?.cf_payment_id || paymentData?.payment_id,
          },
          { new: true }
        );

        if (order) {
          await sendOrderConfirmation(order);
          console.log(`✅ Cashfree payment confirmed for Order: ${order._id}`);
        }
      }
    }
  }

  res.status(200).json({ status: 'OK' });
});
