const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a 4-digit OTP verification email via Resend.
 * @param {string} to  - recipient email address
 * @param {string} otp - 4-digit OTP string
 */
async function sendOtpEmail(to, otp) {
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@synergymedicalyoga.com';

  await resend.emails.send({
    from: fromAddress,
    to,
    subject: `${otp} is your Synergy Medical Yoga verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafb; padding: 32px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png"
               alt="Synergy Medical Yoga" height="60" style="object-fit: contain;" />
        </div>
        <div style="background: #ffffff; border-radius: 10px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h2 style="color: #005550; font-size: 22px; margin: 0 0 12px 0;">Verify your email address</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
            Thank you for signing up with Synergy Medical Yoga. Use the code below to verify your email address.
            This code expires in <strong>10 minutes</strong>.
          </p>
          <div style="background: #f0faf8; border: 2px dashed #005550; border-radius: 10px; text-align: center; padding: 24px 0; margin-bottom: 28px;">
            <span style="font-size: 48px; font-weight: 900; letter-spacing: 16px; color: #005550;">${otp}</span>
          </div>
          <p style="color: #888; font-size: 13px; margin: 0;">
            If you did not request this code, you can safely ignore this email. Do not share this code with anyone.
          </p>
        </div>
        <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} Synergy Medical Yoga. All rights reserved.
        </p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };
