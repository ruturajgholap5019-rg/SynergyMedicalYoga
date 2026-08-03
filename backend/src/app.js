const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { stripeWebhook, cashfreeWebhook } = require('./controllers/orderController');

const app = express();

app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.post('/api/orders/cashfree-webhook', express.raw({ type: 'application/json' }), cashfreeWebhook);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
  })
);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Not allowed by origin configuration (${origin})`));
    }
  },
  credentials: true,
}));

// Apply global API rate limiter against DDoS and automated scrapers
app.use('/api', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Serve uploaded static files with 30-day browser caching
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '30d',
  immutable: true,
  etag: true,
}));

app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'success',
    message: 'SynergyMedical API is online and running successfully 🚀',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: '/api/admin',
      public: '/api/public',
      appointments: '/api/appointments',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact', contactRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
