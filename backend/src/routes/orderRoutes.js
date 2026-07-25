const express = require('express');
const { createOrder, getUserOrders, getOrder, createCheckoutSession } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.post('/checkout', createCheckoutSession);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

module.exports = router;
