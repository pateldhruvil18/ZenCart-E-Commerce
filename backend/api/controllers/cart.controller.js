const Cart = require('../models/cart.schema');
const Product = require('../models/product.schema');
const buildResponse = require('../utils/buildResponse');
const buildErrorObject = require('../utils/buildErrorObject');
const handleError = require('../utils/handleError');

const getCartQuery = (req) => req.user ? { userId: req.user.id } : { sessionId: req.headers['x-session-id'] };

// GET /cart
const getCart = async (req, res) => {
  try {
    const cartQuery = getCartQuery(req);
    if (!cartQuery.userId && !cartQuery.sessionId) {
      return buildResponse(res, 200, { items: [] });
    }
    const cart = await Cart.findOne(cartQuery).populate('items.product');
    return buildResponse(res, 200, cart || { items: [] });
  } catch (err) {
    return handleError(res, err);
  }
};

// POST /cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cartQuery = getCartQuery(req);
    if (!cartQuery.userId && !cartQuery.sessionId) {
      return handleError(res, buildErrorObject(400, 'Session ID required for guest cart'));
    }
    const product = await Product.findById(productId);
    if (!product) return handleError(res, buildErrorObject(404, 'Product not found'));
    if (product.stock < quantity) return handleError(res, buildErrorObject(400, 'Insufficient stock'));

    let cart = await Cart.findOne(cartQuery);
    if (!cart) {
      cart = new Cart({ ...cartQuery, items: [] });
    }

    const existingIdx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }
    await cart.save();
    await cart.populate('items.product');
    return buildResponse(res, 200, cart, 'Item added to cart');
  } catch (err) {
    return handleError(res, err);
  }
};

// PATCH /cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    const cartQuery = getCartQuery(req);
    const cart = await Cart.findOne(cartQuery);
    if (!cart) return handleError(res, buildErrorObject(404, 'Cart not found'));

    const itemIdx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIdx < 0) return handleError(res, buildErrorObject(404, 'Item not in cart'));

    if (quantity <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      cart.items[itemIdx].quantity = Number(quantity);
    }
    await cart.save();
    await cart.populate('items.product');
    return buildResponse(res, 200, cart, 'Cart updated');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cartQuery = getCartQuery(req);
    const cart = await Cart.findOne(cartQuery);
    if (!cart) return handleError(res, buildErrorObject(404, 'Cart not found'));
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    return buildResponse(res, 200, cart, 'Item removed from cart');
  } catch (err) {
    return handleError(res, err);
  }
};

// DELETE /cart (clear all)
const clearCart = async (req, res) => {
  try {
    const cartQuery = getCartQuery(req);
    await Cart.findOneAndDelete(cartQuery);
    return buildResponse(res, 200, null, 'Cart cleared');
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
