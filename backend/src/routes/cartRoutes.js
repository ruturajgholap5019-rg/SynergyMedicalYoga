const express = require('express');
const { getCart, addToCart, updateCartItem, removeFromCart, mergeCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.post('/merge', mergeCart);

module.exports = router;
