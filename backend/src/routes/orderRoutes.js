const express = require('express');
const { createOrder, getUserOrders, getOrder, createCheckoutSession, cashfreeWebhook } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public webhook route for Cashfree payment status updates
router.post('/cashfree-webhook', cashfreeWebhook);

// Protected order routes
router.use(protect);

router.post('/', createOrder);
router.post('/checkout', createCheckoutSession);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/my-orders', getUserOrders);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;
