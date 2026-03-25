const express = require('express');
const router = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, deleteReview, getAllUsers, getAllProducts } = require('../controllers/admin.controller');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/reviews/:id', deleteReview);
router.get('/users', getAllUsers);
router.get('/all-products', getAllProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
