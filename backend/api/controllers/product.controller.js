const Product = require('../models/product.schema');
const Review = require('../models/review.schema');
const Order = require('../models/order.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

// GET /products
const getProducts = async (req, res) => {
  try {
    let {
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

    let suggestedSearch = null;

    // Validate and sanitize search: Escape regex special characters to prevent RegExp errors
    if (search && typeof search === 'string') {
      const sanitized = search.trim();
      const sanitizedSearch = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      if (sanitizedSearch) {
        // Split terms allowing for partial word matches (mimicking fuzzy search)
        const words = sanitizedSearch.split(/\s+/);
        const orConditions = [];
        
        words.forEach(word => {
          // Substring match
          const exactRegex = new RegExp(word, 'i');
          // Basic typo tolerance (e.g. "iphon" -> matches "iphone" and "iphoen" safely without being overly aggressive)
          const fuzzyPattern = word.split('').join('.?'); 
          const fuzzyRegex = new RegExp(fuzzyPattern, 'i');
          
          orConditions.push({ name: fuzzyRegex });
          orConditions.push({ description: exactRegex });
          orConditions.push({ tags: exactRegex });
        });
        
        query.$or = orConditions;

        // Provide a basic fallback 'did you mean' suggestion for common typos
        if (words.length === 1 && !sanitized.endsWith('s')) {
          suggestedSearch = sanitized + 's';
        }
      }
    }

    if (category) query.category = String(category).toLowerCase();

    // Validate and sanitize price range
    if (minPrice || maxPrice) {
      query.price = {};
      const min = Number(minPrice);
      const max = Number(maxPrice);
      
      if (!isNaN(min)) query.price.$gte = min;
      if (!isNaN(max)) query.price.$lte = max;
      
      // If no valid price filters were added, remove the empty price object
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    // Validate and sanitize rating
    const numRating = Number(rating);
    if (!isNaN(numRating) && numRating > 0) {
      query.rating = { $gte: numRating };
    }

    const sortOptions = {};
    if (sortBy === 'price') sortOptions.price = order === 'asc' ? 1 : -1;
    else if (sortBy === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    // Validate and sanitize pagination to avoid NaN or negative skip
    let numPage = Math.max(1, parseInt(page) || 1);
    let numLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (numPage - 1) * numLimit;

    // Execute query with validated parameters
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .select('name price originalPrice category brand images stock rating numReviews isFeatured isTrending')
        .sort(sortOptions)
        .skip(skip)
        .limit(numLimit)
        .lean(),
      Product.countDocuments(query),
    ]);
    
    const totalPages = Math.ceil(totalCount / numLimit);

    return buildResponse(res, 200, { 
      products, 
      totalPages, 
      currentPage: numPage, 
      totalCount,
      suggestedSearch: totalCount === 0 ? suggestedSearch : null
    });
  } catch (err) {
    // If something still goes wrong, the error handler will catch it safely
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

    if (!rating && (!comment || !comment.trim())) {
      return handleError(res, buildErrorObject(400, 'Please provide either a rating or a comment'));
    }

    const review = await Review.create({
      product: product._id,
      user: req.user.id,
      name: req.user.name || 'User',
      rating: rating ? Number(rating) : 0,
      comment: comment || '',
    });

    // Recalculate product rating (Only count reviews that have a rating > 0)
    const allReviews = await Review.find({ product: product._id });
    const ratedReviews = allReviews.filter(r => r.rating > 0);
    
    product.numReviews = allReviews.length;
    product.rating = ratedReviews.length > 0 
      ? ratedReviews.reduce((acc, r) => acc + r.rating, 0) / ratedReviews.length 
      : 0;
    
    await product.save();

    return buildResponse(res, 201, review, 'Review added');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview };
