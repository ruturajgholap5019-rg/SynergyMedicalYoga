const nodemailer = require('nodemailer');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const isDummySmtp = (val) => {
  if (!val) return true;
  const s = String(val).trim().toLowerCase();
  return (
    s === '' ||
    s.includes('your_email') ||
    s.includes('your_app_password') ||
    s.includes('example.com') ||
    s.includes('replace_with') ||
    s.includes('change_this')
  );
};

const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;

  if (isDummySmtp(smtpUser) || isDummySmtp(smtpPass) || isDummySmtp(smtpHost)) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_PORT) === '465',
    auth: {
      user: smtpUser.trim(),
      pass: smtpPass.replace(/\s+/g, ''),
    },
    connectionTimeout: 4000,
    greetingTimeout: 2500,
    socketTimeout: 4000,
  });
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('[EMAIL TESTING MODE] SMTP credentials are not configured or dummy; message simulated & logged.');
      return { success: true, simulated: true };
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP email send timeout after 4000ms')), 4000)
    );

    const info = await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email dispatch error:', err.message);
    return { success: false, error: err.message, simulated: true };
  }
};

exports.sendOrderConfirmation = async (order) => {
  const recipient = order.user?.email || order.email;
  if (!recipient) return { success: false, skipped: true };

  const mailOptions = {
    from: `"Synergy Medical Yoga" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'ruturajgholap5019@gmail.com'}>`,
    to: recipient,
    subject: `Order received #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #005550;">Order received</h2>
        <p>Your order <strong>#${escapeHtml(order._id)}</strong> has been received and is pending confirmation.</p>
        <p>Total Amount: <strong>INR ${escapeHtml(order.totalAmount)}</strong></p>
      </div>
    `,
  };

  return sendEmail(mailOptions);
};

exports.sendContactEmail = async (data) => {
  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ruturajgholap5019@gmail.com';
  const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'ruturajgholap5019@gmail.com';

  const mailOptions = {
    from: `"Synergy Contact Form" <${senderEmail}>`,
    to: targetEmail,
    replyTo: data.email,
    subject: `[Website Inquiry] ${escapeHtml(data.subject || 'New Contact Message')} - ${escapeHtml(data.name)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #005550; padding: 18px; color: white;">
          <h2 style="margin: 0; font-size: 20px;">Synergy Medical Yoga</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px;">New website enquiry</p>
        </div>
        <div style="padding: 22px; background-color: #ffffff;">
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(data.subject || 'General Inquiry / Consultation')}</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 18px 0;" />
          <p><strong>Message / Symptoms:</strong></p>
          <div style="white-space: pre-line; background: #f7fbfb; border-left: 4px solid #005550; padding: 12px;">
            ${escapeHtml(data.message)}
          </div>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
};

exports.sendOtpEmail = async ({ email, name, otp }) => {
  const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'ruturajgholap5019@gmail.com';
  const recipients = [email, 'ruturajgholap5019@gmail.com'].filter((e, i, a) => e && a.indexOf(e) === i).join(', ');

  const mailOptions = {
    from: `"Synergy Medical Yoga" <${senderEmail}>`,
    to: recipients,
    subject: `[Synergy Yoga] ${otp} is your Sign Up Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
        <div style="background-color: #005550; padding: 16px 24px; border-radius: 8px; color: white; text-align: center;">
          <h2 style="margin: 0; font-size: 22px;">Synergy Medical Yoga</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #a3e635;">Account Sign Up Verification</p>
        </div>
        <div style="padding: 24px 0; text-align: center;">
          <p style="font-size: 15px; color: #444;">Hello <strong>${escapeHtml(name)}</strong>,</p>
          <p style="font-size: 14px; color: #666;">Use the following 4-digit verification code to complete your registration:</p>
          <div style="margin: 24px auto; display: inline-block; background-color: #f0fdf4; border: 2px dashed #005550; border-radius: 12px; padding: 16px 36px;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #005550;">${escapeHtml(otp)}</span>
          </div>
          <p style="font-size: 12px; color: #888;">This code is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      </div>
    `,
  };

  return sendEmail(mailOptions);
};
