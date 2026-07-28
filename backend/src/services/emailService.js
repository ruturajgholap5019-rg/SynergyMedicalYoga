const nodemailer = require('nodemailer');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpUser || !smtpPass || !smtpHost) {
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
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('[EMAIL DISABLED] SMTP env vars are not configured; message stored only.');
      return { success: false, skipped: true };
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP email send timeout after 8000ms')), 8000)
    );

    const info = await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email dispatch error:', err.message);
    return { success: false, error: err.message };
  }
};

exports.sendOrderConfirmation = async (order) => {
  const recipient = order.user?.email || order.email;
  if (!recipient) return { success: false, skipped: true };

  const mailOptions = {
    from: `"Synergy Medical Yoga" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
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
  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL;
  const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!targetEmail || !senderEmail) return { success: false, skipped: true };

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
