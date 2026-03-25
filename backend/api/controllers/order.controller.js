const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.schema');
const Cart = require('../models/cart.schema');
const Address = require('../models/address.schema');
const Product = require('../models/product.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /checkout/create-order
const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod = 'RAZORPAY', directItems } = req.body;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return handleError(res, buildErrorObject(404, 'Address not found'));
    }

    let orderItems = [];
    let totalAmount = 0;
    const isDirectPurchase = Array.isArray(directItems) && directItems.length > 0;

    if (isDirectPurchase) {
      const productIds = directItems.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      
      for (const item of directItems) {
        const product = products.find(p => p._id.toString() === item.product);
        if (!product || product.stock < item.quantity) {
          return handleError(res, buildErrorObject(400, `Insufficient stock for: ${product?.name || 'product'}`));
        }
        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.price,
          quantity: item.quantity,
        });
        totalAmount += product.price * item.quantity;
      }
    } else {
      const cart = await Cart.findOne({ userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return handleError(res, buildErrorObject(400, 'Your cart is empty'));
      }
      
      for (const item of cart.items) {
        if (!item.product || item.product.stock < item.quantity) {
          return handleError(res, buildErrorObject(400, `Insufficient stock for: ${item.product?.name || 'a product'}`));
        }
        orderItems.push({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0] || '',
          price: item.price,
          quantity: item.quantity,
        });
        totalAmount += item.price * item.quantity;
      }
    }

    const orderPayload = {
      userId,
      items: orderItems,
      address: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },
      totalAmount,
    };

    // CASH ON DELIVERY BYPASS
    if (paymentMethod === 'COD') {
      const order = await Order.create({
        ...orderPayload,
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
      });

      // Synchronize Stock Automatically (COD)
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
      }

      if (!isDirectPurchase) await Cart.findOneAndDelete({ userId });
      return buildResponse(res, 201, { orderId: order._id, bypassRazorpay: true }, 'Order placed successfully');
    }

    if (paymentMethod !== 'RAZORPAY') {
       return handleError(res, buildErrorObject(400, 'Invalid payment method'));
    }

    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random()*1000)}`,
    });

    // Create pending order placeholder so verifyPayment has data
    const order = await Order.create({
      ...orderPayload,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      razorpayOrderId: razorpayOrder.id,
    });

    return buildResponse(res, 200, {
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      isDirectPurchase
    }, 'Order created');
  } catch (err) {
    console.error('Razorpay Order Creation Error:', err);
    return handleError(res, err);
  }
};

// POST /checkout/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, isDirectPurchase } = req.body;
    const userId = req.user.id;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return handleError(res, buildErrorObject(400, 'Payment verification failed: Invalid signature'));
    }

    const order = await Order.findOne({ razorpayOrderId, userId });
    if (!order) {
      return handleError(res, buildErrorObject(404, 'Order framework missing'));
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    // Synchronize Stock Automatically (Razorpay Paid)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Clear cart after successful order IF not a direct override
    if (!isDirectPurchase) {
      await Cart.findOneAndDelete({ userId });
    }

    return buildResponse(res, 201, { orderId: order._id }, 'Payment verified and order placed successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /orders (my orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate('items.product', 'name images').lean();
    return buildResponse(res, 200, orders);
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).populate('items.product').lean();
    if (!order) return handleError(res, buildErrorObject(404, 'Order not found'));
    return buildResponse(res, 200, order);
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { createOrder, verifyPayment, getMyOrders, getOrderById };
