const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders, getOrderById } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-orders', getMyOrders);
router.get('/my-orders/:id', getOrderById);

module.exports = router;
