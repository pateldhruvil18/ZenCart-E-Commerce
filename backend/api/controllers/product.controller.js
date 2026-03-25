const Product = require('../models/product.schema');
const Review = require('../models/review.schema');
const Order = require('../models/order.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

// GET /products
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      minPrice,
      maxPrice,
      rating,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { tags: regex }];
    }
    if (category) query.category = category.toLowerCase();
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };

    const sortOptions = {};
    if (sortBy === 'price') sortOptions.price = order === 'asc' ? 1 : -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / Number(limit));

    return buildResponse(res, 200, { products, totalPages, currentPage: Number(page), totalCount });
  } catch (err) {
    return handleError(res, err);
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return handleError(res, buildErrorObject(404, 'Product not found'));
    const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort({ createdAt: -1 }).lean();
    
    let canReview = false;
    if (req.user) {
      const Order = require('../models/order.schema');
      const hasPurchased = await Order.findOne({
        userId: req.user.id,
        'items.product': product._id,
        orderStatus: 'delivered'
      });
      if (hasPurchased) canReview = true;
    }

    return buildResponse(res, 200, { product, reviews, canReview });
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /products (admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return buildResponse(res, 201, product, 'Product created successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return handleError(res, buildErrorObject(404, 'Product not found'));
    return buildResponse(res, 200, product, 'Product updated successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return handleError(res, buildErrorObject(404, 'Product not found'));
    return buildResponse(res, 200, null, 'Product deleted successfully');
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /products/:id/reviews (protected user)
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return handleError(res, buildErrorObject(404, 'Product not found'));

    // Verified Purchaser Validation
    const hasPurchased = await Order.findOne({ 
      userId: req.user.id, 
      'items.product': product._id, 
      orderStatus: 'delivered' 
    });
    
    if (!hasPurchased) {
      return handleError(res, buildErrorObject(403, 'You must purchase and receive this product before reviewing it.'));
    }

    const existing = await Review.findOne({ product: product._id, user: req.user.id });
    if (existing) return handleError(res, buildErrorObject(409, 'You have already reviewed this product'));

    const review = await Review.create({
      product: product._id,
      user: req.user.id,
      name: req.user.name || 'User',
      rating: Number(rating),
      comment,
    });

    // Recalculate product rating
    const allReviews = await Review.find({ product: product._id });
    product.numReviews = allReviews.length;
    product.rating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await product.save();

    return buildResponse(res, 201, review, 'Review added');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview };
