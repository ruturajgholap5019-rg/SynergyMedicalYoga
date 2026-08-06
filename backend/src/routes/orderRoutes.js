const express = require('express');
const { createOrder, getUserOrders, getOrder, createCheckoutSession } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public guest and authenticated checkout sessions
router.post('/checkout', createCheckoutSession);
router.post('/create-checkout-session', createCheckoutSession);

// Protected user order routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
