const Product = require('../models/product.schema');
const Order = require('../models/order.schema');
const Review = require('../models/review.schema');
const User = require('../models/user.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

// GET /admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueResult] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { $or: [{ paymentStatus: 'paid' }, { orderStatus: 'delivered' }] } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    return buildResponse(res, 200, { totalProducts, totalOrders, totalUsers, totalRevenue });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
        .populate('userId', 'name email'),
      Order.countDocuments(query),
    ]);
    return buildResponse(res, 200, { orders, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return handleError(res, buildErrorObject(404, 'Order not found'));
    order.orderStatus = orderStatus;
    // COD order delivered → automatically mark as paid so revenue is counted
    if (orderStatus === 'delivered' && !order.razorpayOrderId) {
      order.paymentStatus = 'paid';
    }
    await order.save();
    return buildResponse(res, 200, order, 'Order status updated');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /admin/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return handleError(res, buildErrorObject(404, 'Review not found'));
    // Recalculate product rating
    const allReviews = await Review.find({ product: review.product });
    const product = await Product.findById(review.product);
    if (product) {
      product.numReviews = allReviews.length;
      product.rating = allReviews.length
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        : 0;
      await product.save();
    }
    return buildResponse(res, 200, null, 'Review deleted');
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-password'),
      User.countDocuments({}),
    ]);
    return buildResponse(res, 200, { users, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /admin/products
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, productId } = req.query;
    const query = {};
    if (category) query.category = category;
    if (productId) query._id = productId;  // exact product ID match
    if (search) query.name = { $regex: search, $options: 'i' };  // case-insensitive name search
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);
    return buildResponse(res, 200, { products, totalPages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getDashboard, getAllOrders, updateOrderStatus, deleteReview, getAllUsers, getAllProducts };
