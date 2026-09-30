const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOrderConfirmation = async (order) => {
  const recipient = order.shippingAddress?.email || order.user?.email;
  if (!recipient) {
    console.warn('No email address found for order confirmation.');
    return;
  }

  const mailOptions = {
    from: `"Synergy Medical Yoga" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Hi ${order.shippingAddress?.name || order.user?.name || 'there'},</p>
      <p>Your order #${order._id} has been placed successfully.</p>
      <p>Payment method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Stripe)'}</p>
      <p>Total Amount: ₹${order.totalAmount}</p>
      <p>We will notify you when your order is shipped.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
