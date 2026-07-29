const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { formSpamLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { appointment } = require('../validators/schemas');

const router = express.Router();

// Patient creates appointment (secured with anti-spam limiter)
router.post('/', formSpamLimiter, validate(appointment), appointmentController.createAppointment);

// Patient views their appointments (requires login)
router.get('/my-appointments', protect, appointmentController.getMyAppointments);

module.exports = router;
