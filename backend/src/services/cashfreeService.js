const crypto = require('crypto');
const Setting = require('../models/Setting');

// Helper to get Cashfree credentials from DB settings or process.env
const getCashfreeCredentials = async () => {
  let appId = (process.env.CASHFREE_APP_ID || '').trim();
  let secretKey = (process.env.CASHFREE_SECRET_KEY || '').trim();
  let mode = (process.env.CASHFREE_ENV || 'SANDBOX').trim();

  try {
    const setting = await Setting.findOne();
    if (setting) {
      if (setting.cashfreeAppId) appId = setting.cashfreeAppId.trim();
      if (setting.cashfreeSecretKey) secretKey = setting.cashfreeSecretKey.trim();
      if (setting.cashfreeMode) mode = setting.cashfreeMode.trim();
    }
  } catch (err) {
    console.error('Failed to fetch Cashfree settings from DB:', err);
  }

  // Smart auto-detection: Prevent "authentication Failed" caused by environment mode mismatch
  const isTestKey = appId.toUpperCase().startsWith('TEST');
  const isExplicitProd = mode.toUpperCase() === 'PRODUCTION';

  let effectiveMode = isExplicitProd ? 'PRODUCTION' : 'SANDBOX';
  if (isTestKey && isExplicitProd) {
    console.warn('⚠️ [CASHFREE AUTO-FIX] Test App ID starting with "TEST" detected while mode was set to PRODUCTION. Auto-routing to Cashfree Sandbox.');
    effectiveMode = 'SANDBOX';
  } else if (!isTestKey && !isExplicitProd && appId.length > 8) {
    console.warn('⚠️ [CASHFREE AUTO-FIX] Live App ID detected while mode was set to SANDBOX. Auto-routing to Cashfree Production.');
    effectiveMode = 'PRODUCTION';
  }

  return { appId, secretKey, mode: effectiveMode };
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

  const rawPhone = (customerInfo?.phone || '').replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';
  const customerEmail = (customerInfo?.email || 'customer@synergymedicalyoga.com').trim();

  const payload = {
    order_id: `CF_${orderId}_${Date.now()}`,
    order_amount: Math.round(amount * 100) / 100,
    order_currency: 'INR',
    customer_details: {
      customer_id: customerInfo?.id || `CUST_${Date.now()}`,
      customer_name: customerInfo?.name || 'Valued Customer',
      customer_email: customerEmail,
      customer_phone: cleanPhone,
    },
    order_meta: {
      return_url: returnUrl,
      ...(notifyUrl && String(notifyUrl).startsWith('https://') ? { notify_url: notifyUrl } : {}),
    },
  };

  console.info('[Cashfree] Creating order session', {
    mode,
    baseUrl,
    appId: appId ? `${appId.slice(0, 6)}...` : 'MISSING',
    order_id: payload.order_id,
    order_amount: payload.order_amount,
  });

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
    console.error('[Cashfree] API error response:', {
      status: response.status,
      statusText: response.statusText,
      response: data,
      request: payload,
    });
    const errorMsg = data.message || data.error || (typeof data.detail === 'string' ? data.detail : (data.detail ? JSON.stringify(data.detail) : 'Failed to create Cashfree payment session.'));
    throw new Error(errorMsg);
  }

  return {
    paymentSessionId: data.payment_session_id,
    cashfreeOrderId: data.order_id,
    orderStatus: data.order_status,
    cfMode: mode.toLowerCase() === 'production' ? 'production' : 'sandbox',
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
