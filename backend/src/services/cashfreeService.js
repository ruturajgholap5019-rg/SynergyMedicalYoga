const crypto = require('crypto');
const Setting = require('../models/Setting');

// Helper to get Cashfree credentials from DB settings or process.env
const getCashfreeCredentials = async () => {
  let appId = process.env.CASHFREE_APP_ID || '';
  let secretKey = process.env.CASHFREE_SECRET_KEY || '';
  let mode = process.env.CASHFREE_ENV || 'SANDBOX';

  try {
    const setting = await Setting.findOne();
    if (setting) {
      if (setting.cashfreeAppId) appId = setting.cashfreeAppId;
      if (setting.cashfreeSecretKey) secretKey = setting.cashfreeSecretKey;
      if (setting.cashfreeMode) mode = setting.cashfreeMode;
    }
  } catch (err) {
    console.error('Failed to fetch Cashfree settings from DB:', err);
  }

  return { appId, secretKey, mode };
};

/**
 * Creates a secure Cashfree Payment Session via Cashfree PG API v3
 */
exports.createCashfreeOrderSession = async ({ orderId, amount, customerInfo, returnUrl, notifyUrl }) => {
  const { appId, secretKey, mode } = await getCashfreeCredentials();

  if (!appId || !secretKey) {
    throw new Error('Cashfree App ID or Secret Key is missing in settings.');
  }

  const baseUrl = mode.toUpperCase() === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg/orders'
    : 'https://sandbox.cashfree.com/pg/orders';

  const payload = {
    order_id: `CF_${orderId}_${Date.now()}`,
    order_amount: Math.round(amount * 100) / 100,
    order_currency: 'INR',
    customer_details: {
      customer_id: customerInfo.id || `CUST_${Date.now()}`,
      customer_name: customerInfo.name || 'Customer',
      customer_email: customerInfo.email || 'customer@example.com',
      customer_phone: customerInfo.phone ? customerInfo.phone.replace(/[^0-9]/g, '').slice(-10) : '9999999999',
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
    },
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Cashfree API error response:', data);
    throw new Error(data.message || 'Failed to create Cashfree payment session.');
  }

  return {
    paymentSessionId: data.payment_session_id,
    cashfreeOrderId: data.order_id,
    orderStatus: data.order_status,
  };
};

/**
 * Verifies Cashfree HMAC-SHA256 Webhook Signature securely
 */
exports.verifyCashfreeSignature = async (rawBody, signature, timestamp) => {
  try {
    const { secretKey } = await getCashfreeCredentials();
    if (!secretKey || !signature || !timestamp) return false;

    const signatureData = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureData)
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    console.error('Cashfree webhook signature verification error:', err);
    return false;
  }
};
