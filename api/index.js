const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/database');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless database connection error:', err);
  }
  return app(req, res);
};
