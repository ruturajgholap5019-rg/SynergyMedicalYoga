const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  getAllUsers,
  getUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/dashboard', getDashboardStats);

module.exports = router;
