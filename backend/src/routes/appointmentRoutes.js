const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Patient creates appointment (can be guest or logged-in)
router.post('/', appointmentController.createAppointment);

// Patient views their appointments (requires login)
router.get('/my-appointments', protect, appointmentController.getMyAppointments);

module.exports = router;
