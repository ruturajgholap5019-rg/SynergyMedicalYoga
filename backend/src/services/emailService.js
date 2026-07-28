const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail = (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail')) || process.env.SMTP_USER.includes('@gmail.com');
    const cleanPass = process.env.SMTP_PASS.replace(/\s+/g, '');
    
    if (isGmail) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER.trim(),
          pass: cleanPass,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: cleanPass,
      },
    });
  }
  return null;
};

const sendEmail = async (mailOptions) => {
  try {
    const transporter = createTransporter();
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully via SMTP:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      console.log('\n======================================================');
      console.log('📧 [DEV EMAIL SIMULATOR] Email dispatch triggered:');
      console.log(`TO: ${mailOptions.to}`);
      console.log(`SUBJECT: ${mailOptions.subject}`);
      console.log(`HTML BODY:\n${mailOptions.html}`);
      console.log('======================================================\n');
      return { success: true, simulated: true };
    }
  } catch (err) {
    console.error('❌ Error dispatching email via SMTP:', err);
    return { success: false, error: err.message };
  }
};

exports.sendOrderConfirmation = async (order) => {
  const mailOptions = {
    from: `"Synergy Medical Yoga" <${process.env.SMTP_USER || 'ruturajgholap5019@gmail.com'}>`,
    to: order.user.email,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #005550;">Thank you for your order!</h2>
        <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
        <p>Total Amount: <strong>₹${order.totalAmount}</strong></p>
        <p>We will notify you when your order is shipped.</p>
      </div>
    `,
  };

  return await sendEmail(mailOptions);
};

exports.sendContactEmail = async (data) => {
  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'ruturajgholap5019@gmail.com';
  const senderEmail = process.env.SMTP_USER || 'ruturajgholap5019@gmail.com';
  
  const mailOptions = {
    from: `"Synergy Contact Form" <${senderEmail}>`,
    to: targetEmail,
    replyTo: data.email,
    subject: `📩 [Website Inquiry] ${data.subject || 'New Contact Message'} - ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #005550; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 22px;">🌿 Synergy Medical Yoga</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">New Website Contact Form Submission</p>
        </div>
        
        <div style="padding: 24px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 130px; color: #555;">Sender Name:</td>
              <td style="padding: 8px 0; color: #111;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone Number:</td>
              <td style="padding: 8px 0; color: #111;"><a href="tel:${data.phone}" style="color: #005550; text-decoration: none; font-weight: bold;">${data.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email Address:</td>
              <td style="padding: 8px 0; color: #111;"><a href="mailto:${data.email}" style="color: #005550; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 8px 0; color: #005550; font-weight: bold;">${data.subject}</td>
            </tr>
          </table>
          
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          
          <h4 style="margin: 0 0 10px 0; color: #005550;">Message / Symptoms Description:</h4>
          <div style="background-color: #f9fbfb; padding: 15px; border-left: 4px solid #005550; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #333; whitespace: pre-line;">
            ${data.message}
          </div>

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eeeeee; font-size: 12px; color: #888; text-align: center;">
            This email was sent from the Contact Us form on Synergy Medical Yoga website.<br />
            Recipient Inbox: <strong>${targetEmail}</strong>
          </div>
        </div>
      </div>
    `,
  };

  return await sendEmail(mailOptions);
};
