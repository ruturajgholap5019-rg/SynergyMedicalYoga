const Stripe = require('stripe');

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey || secretKey === 'sk_test_dummy') {
  console.warn(
    '⚠️  STRIPE_SECRET_KEY is not configured. Online payments will fail until you add a valid Stripe test key to backend/.env'
  );
}

const stripe = secretKey ? Stripe(secretKey) : null;

const isStripeConfigured = () => Boolean(secretKey && secretKey !== 'sk_test_dummy');

module.exports = stripe;
module.exports.isStripeConfigured = isStripeConfigured;
