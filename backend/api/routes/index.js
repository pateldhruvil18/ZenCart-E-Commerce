const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/wishlist', require('./wishlist.routes'));
router.use('/address', require('./address.routes'));
router.use('/checkout', require('./order.routes'));
router.use('/profile', require('./profile.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/upload', require('./upload.routes'));

module.exports = router;
