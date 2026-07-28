const express = require('express');
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const { adminUser, product, service, carousel, content } = require('../validators/schemas');

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
  .post(validate(adminUser.create), adminController.createUser);

router
  .route('/users/:id')
  .get(adminController.getUser)
  .put(validate(adminUser.update), adminController.updateUser)
  .delete(adminController.deleteUser);

// Product CRUD
router
  .route('/products')
  .get(adminController.getAllProducts)
  .post(validate(product), adminController.createProduct);

router
  .route('/products/:id')
  .put(validate(product.partial()), adminController.updateProduct)
  .delete(adminController.deleteProduct);

// Order Management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

// Carousel CRUD
router
  .route('/carousels')
  .get(adminController.getAllCarousels)
  .post(validate(carousel), adminController.createCarousel);

router
  .route('/carousels/:id')
  .put(validate(carousel.partial()), adminController.updateCarousel)
  .delete(adminController.deleteCarousel);

// Services CRUD
router
  .route('/services')
  .get(adminController.getAllServices)
  .post(validate(service), adminController.createService);

router
  .route('/services/:id')
  .put(validate(service.partial()), adminController.updateService)
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

// Contact Messages Management
router.get('/contact-messages', adminController.getAllContactMessages);
router.put('/contact-messages/:id/status', validate(content.simpleStatus), adminController.updateContactMessageStatus);
router.delete('/contact-messages/:id', adminController.deleteContactMessage);

// Website CMS Content Management
router
  .route('/content')
  .get(adminController.getContentItems)
  .post(validate(content.item), adminController.createContentItem);

router
  .route('/content/:id')
  .put(validate(content.item.partial()), adminController.updateContentItem)
  .delete(adminController.deleteContentItem);

// Image Upload Routes (Multer)
router.post('/upload', upload.single('image'), adminController.uploadImage);
router.post('/upload-multiple', upload.array('images', 5), adminController.uploadImages);

module.exports = router;
