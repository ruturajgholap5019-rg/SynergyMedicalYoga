const test = require('node:test');
const assert = require('node:assert/strict');
const emailService = require('../src/services/emailService');

test('sendEmail falls back to simulated success in production when no mail provider is configured', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousResendApiKey = process.env.RESEND_API_KEY;
  const previousSmtpHost = process.env.SMTP_HOST;
  const previousSmtpUser = process.env.SMTP_USER;
  const previousSmtpPass = process.env.SMTP_PASS;

  process.env.NODE_ENV = 'production';
  delete process.env.RESEND_API_KEY;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  try {
    const result = await emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Test email',
      html: '<p>Test</p>',
    });

    assert.equal(result.success, true);
    assert.equal(result.simulated, true);
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }

    if (previousResendApiKey === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = previousResendApiKey;
    }

    if (previousSmtpHost === undefined) {
      delete process.env.SMTP_HOST;
    } else {
      process.env.SMTP_HOST = previousSmtpHost;
    }

    if (previousSmtpUser === undefined) {
      delete process.env.SMTP_USER;
    } else {
      process.env.SMTP_USER = previousSmtpUser;
    }

    if (previousSmtpPass === undefined) {
      delete process.env.SMTP_PASS;
    } else {
      process.env.SMTP_PASS = previousSmtpPass;
    }
  }
});
