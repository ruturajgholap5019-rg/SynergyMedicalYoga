const express = require('express');
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Apply auth & admin middleware to all routes in this router
router.use(protect);
router.use(admin);

// Dashboard metrics
router.get('/dashboard', adminController.getDashboardStats);

// User CRUD
router
  .route('/users')
  .get(adminController.getAllUsers)
  .post(adminController.createUser);

router
  .route('/users/:id')
  .get(adminController.getUser)
  .put(adminController.updateUser)
  .delete(adminController.deleteUser);

// Product CRUD
router
  .route('/products')
  .get(adminController.getAllProducts)
  .post(adminController.createProduct);

router
  .route('/products/:id')
  .put(adminController.updateProduct)
  .delete(adminController.deleteProduct);

// Order Management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

// Carousel CRUD
router
  .route('/carousels')
  .get(adminController.getAllCarousels)
  .post(adminController.createCarousel);

router
  .route('/carousels/:id')
  .put(adminController.updateCarousel)
  .delete(adminController.deleteCarousel);

// Services CRUD
router
  .route('/services')
  .get(adminController.getAllServices)
  .post(adminController.createService);

router
  .route('/services/:id')
  .put(adminController.updateService)
  .delete(adminController.deleteService);

// Payment Gateway Settings (UPI & Scanner)
router
  .route('/settings')
  .get(adminController.getPaymentSettings)
  .put(adminController.updatePaymentSettings);

// Appointment Management
router.get('/appointments', adminController.getAllAppointments);
router.put('/appointments/:id/status', adminController.updateAppointmentStatus);
router.delete('/appointments/:id', adminController.deleteAppointment);

module.exports = router;
