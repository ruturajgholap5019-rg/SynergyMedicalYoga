const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCashfreeReturnUrl } = require('../src/utils/paymentGateway');

test('buildCashfreeReturnUrl normalizes the success URL', () => {
  assert.equal(
    buildCashfreeReturnUrl('https://synergy-medical-yoga.vercel.app'),
    'https://synergy-medical-yoga.vercel.app/order-success?order_id={order_id}'
  );
});

test('buildCashfreeReturnUrl preserves a path and removes placeholders', () => {
  assert.equal(
    buildCashfreeReturnUrl('https://example.com/checkout/{order_id}?session_id=abc'),
    'https://example.com/order-success?order_id={order_id}'
  );
});
