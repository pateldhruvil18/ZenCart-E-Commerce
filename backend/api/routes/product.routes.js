const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview } = require('../controllers/product.controller');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth.middleware');
const setCacheControl = require('../middlewares/cache.middleware');

router.get('/', optionalAuth, setCacheControl(60), getProducts); // Cache list for 60s
router.get('/:id', optionalAuth, setCacheControl(60), getProductById); // Cache details for 60s
router.post('/', protect, adminOnly, createProduct);
router.patch('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
