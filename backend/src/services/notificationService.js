const emailService = require('./emailService');

const sendTwilioWhatsApp = async ({ toPhone, message }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (!accountSid || !authToken) {
    return { success: false, skipped: true, reason: 'Twilio credentials not configured' };
  }

  try {
    const twilio = require('twilio')(accountSid, authToken);
    const formattedPhone = toPhone.startsWith('+') ? toPhone : `+91${toPhone.replace(/\D/g, '')}`;
    const res = await twilio.messages.create({
      from: fromWhatsApp,
      to: `whatsapp:${formattedPhone}`,
      body: message,
    });
    return { success: true, sid: res.sid };
  } catch (err) {
    console.error('Twilio WhatsApp Notification Error:', err.message);
    return { success: false, error: err.message };
  }
};

exports.sendAppointmentNotification = async ({
  patientName,
  patientPhone,
  patientEmail,
  serviceTitle,
  appointmentDate,
  timeSlot,
  center = 'Greens Center, Chinchwad, Pune',
}) => {
  const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const whatsappMessage = 
`🧘‍♀️ *Synergy Medical Yoga Therapy Appointment Confirmed*

Hello ${patientName},
Your therapy appointment has been successfully scheduled!

📋 *Service*: ${serviceTitle}
📅 *Date*: ${formattedDate}
⏰ *Time Slot*: ${timeSlot}
📍 *Clinic Location*: ${center}

🗺️ *Directions*: https://maps.google.com/?q=Synergy+Medical+Yoga+Pune

Please arrive 10 minutes prior to your scheduled time.
For queries, contact us at +91 97303 21042.

_Synergy Medical Yoga - Non-surgical Pain Realignment_`;

  console.log(`📱 [NOTIFICATION] Dispatching appointment booking alerts to ${patientPhone} / ${patientEmail}...`);

  // 1. Dispatch WhatsApp Notification asynchronously
  const whatsappRes = await sendTwilioWhatsApp({ toPhone: patientPhone, message: whatsappMessage });

  // 2. Email Notification Fallback
  let emailRes = { success: false };
  if (patientEmail) {
    emailRes = await emailService.sendContactEmail({
      name: patientName,
      phone: patientPhone,
      email: patientEmail,
      subject: `Appointment Confirmed: ${serviceTitle} on ${formattedDate}`,
      message: whatsappMessage,
    });
  }

  return {
    whatsapp: whatsappRes,
    email: emailRes,
  };
};

exports.sendOrderNotification = async ({ orderId, customerName, phone, email, totalAmount, paymentMethod }) => {
  const whatsappMessage = 
`📦 *Synergy Medical Yoga Order Received*

Hello ${customerName || 'Valued Patient'},
Thank you for your order!

🆔 *Order ID*: #${orderId}
💰 *Total Amount*: ₹${totalAmount}
💳 *Payment Method*: ${String(paymentMethod).toUpperCase()}
📦 *Status*: Processing

We will notify you as soon as your orthopaedic product is dispatched!
_Synergy Medical Yoga_`;

  console.log(`📦 [NOTIFICATION] Dispatching order alerts for #${orderId}...`);

  const whatsappRes = await sendTwilioWhatsApp({ toPhone: phone || '', message: whatsappMessage });
  
  return {
    whatsapp: whatsappRes,
  };
};
