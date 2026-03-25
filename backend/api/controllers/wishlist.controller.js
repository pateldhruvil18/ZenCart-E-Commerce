const Wishlist = require('../models/wishlist.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

const getWishlistQuery = (req) => req.user ? { user: req.user.id } : { sessionId: req.headers['x-session-id'] };

// GET /wishlist
const getWishlist = async (req, res) => {
  try {
    const query = getWishlistQuery(req);
    if (!query.user && !query.sessionId) {
      return buildResponse(res, 200, { products: [] });
    }
    const wishlist = await Wishlist.findOne(query).populate('products');
    return buildResponse(res, 200, wishlist || { products: [] });
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const query = getWishlistQuery(req);
    if (!query.user && !query.sessionId) {
      return handleError(res, buildErrorObject(400, 'Session ID required for guest wishlist'));
    }

    let wishlist = await Wishlist.findOne(query);
    if (!wishlist) {
      wishlist = new Wishlist({ ...query, products: [] });
    }
    if (wishlist.products.some(p => p.toString() === productId)) {
      return handleError(res, buildErrorObject(409, 'Product already in wishlist'));
    }
    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate('products');
    return buildResponse(res, 200, wishlist, 'Added to wishlist');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const query = getWishlistQuery(req);
    const wishlist = await Wishlist.findOne(query);
    if (!wishlist) return handleError(res, buildErrorObject(404, 'Wishlist not found'));
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products');
    return buildResponse(res, 200, wishlist, 'Removed from wishlist');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
