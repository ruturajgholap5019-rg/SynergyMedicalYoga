const test = require('node:test');
const assert = require('node:assert/strict');
const { auth } = require('../src/validators/schemas');

test('verifyOtp accepts the 4-digit code used by the signup UI', () => {
  const result = auth.verifyOtp.safeParse({
    email: 'user@example.com',
    otp: '1234',
  });

  assert.equal(result.success, true);
});

test('verifyOtp still accepts a 6-digit code', () => {
  const result = auth.verifyOtp.safeParse({
    email: 'user@example.com',
    otp: '123456',
  });

  assert.equal(result.success, true);
});
