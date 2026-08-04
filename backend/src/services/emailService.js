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
    return { transporter: null, error: 'Email service is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, and CONTACT_RECEIVER_EMAIL.' };
  }

  return { transporter: nodemailer.createTransport({
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
  }) };
};

const getResendSender = () => {
  const configuredSender = process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!configuredSender || isDummySmtp(configuredSender)) {
    return 'onboarding@resend.dev';
  }
  return configuredSender;
};

const sendViaResend = async (mailOptions) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ruturajgholap5019@gmail.com';
  const senderEmail = getResendSender();
  const senderName = process.env.RESEND_FROM_NAME || 'Synergy Medical Yoga';

  const attemptSend = async (toAddresses) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: toAddresses,
        subject: mailOptions.subject,
        html: mailOptions.html,
      }),
    });
    return res.json();
  };

  try {
    let toList = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
    let data = await attemptSend(toList);
    if (data.id) {
      console.log('✅ [RESEND EMAIL DELIVERED] Message ID:', data.id);
      return { success: true, messageId: data.id };
    }

    // Fallback: If free tier restricts to registered email ruturajgholap5019@gmail.com
    if (data.name === 'validation_error' || data.message?.includes('testing') || data.statusCode === 403) {
      console.log('ℹ️ [RESEND TESTING MODE] Dispatching email to verified account:', targetEmail);
      data = await attemptSend([targetEmail]);
      if (data.id) {
        console.log('✅ [RESEND EMAIL DELIVERED TO VERIFIED ACCOUNT] Message ID:', data.id);
        return { success: true, messageId: data.id };
      }
    }
    console.error('❌ [RESEND EMAIL ERROR]:', data);
    return null;
  } catch (err) {
    console.error('❌ [RESEND FETCH ERROR]:', err.message);
    return null;
  }
};

const sendEmail = async (mailOptions) => {
  // 1. Try Resend HTTP API if configured (Fast, non-blocking HTTP REST API)
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend(mailOptions);
    if (resendResult?.success) return resendResult;
  }

  // 2. Try Nodemailer SMTP if credentials are valid
  const { transporter, error: configurationError } = createTransporter();
  if (transporter) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP email send timeout after 5000ms')), 5000)
      );

      const info = await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
      console.log('✅ [SMTP EMAIL DELIVERED] Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('⚠️ [SMTP DISPATCH ERROR]:', err.message);
    }
  } else if (configurationError) {
    console.log(`ℹ️ [EMAIL TESTING MODE]: ${configurationError}`);
  }

  if (process.env.NODE_ENV === 'production') {
    return { success: false, error: 'Email delivery is unavailable right now.' };
  }

  // 3. Testing Mode Fallback (keeps local/dev flows working without blocking the app)
  console.log('🔑 [SIMULATED EMAIL DISPATCH] Recipient:', mailOptions.to, 'Subject:', mailOptions.subject);
  return { success: true, simulated: true };
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
  const senderEmail = process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || 'onboarding@resend.dev';

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
  const senderEmail = process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || 'onboarding@resend.dev';
  const recipients = [email, 'ruturajgholap5019@gmail.com'].filter((e, i, a) => e && a.indexOf(e) === i);

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
