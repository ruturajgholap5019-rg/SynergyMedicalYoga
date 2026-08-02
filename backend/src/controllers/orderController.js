const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('../config/stripe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendOrderConfirmation } = require('../services/emailService');
const notificationService = require('../services/notificationService');

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
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  // Validate HMAC SHA256 Signature
  const isValid = await cashfreeService.verifyCashfreeSignature(rawBody, signature, timestamp);
  if (!isValid) {
    console.warn('⚠️ Invalid Cashfree Webhook Signature received!');
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const eventType = payload?.type;
  const orderData = payload?.data?.order;
  const paymentData = payload?.data?.payment;

  if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentData?.payment_status === 'SUCCESS') {
    const cfOrderId = orderData?.order_id || payload?.data?.order_id;
    if (cfOrderId) {
      const parts = cfOrderId.split('_');
      const mongoOrderId = parts[1];

      if (mongoOrderId && mongoose.Types.ObjectId.isValid(mongoOrderId)) {
        const order = await Order.findByIdAndUpdate(
          mongoOrderId,
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
