const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

module.exports = (req, res) => {
  // Trigger DB connection in background without blocking serverless HTTP response
  connectDB().catch((err) => {
    console.error('Serverless database connection error:', err);
  });
  return app(req, res);
};
