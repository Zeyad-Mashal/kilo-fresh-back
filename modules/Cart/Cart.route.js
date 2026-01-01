const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCartItems,
  updateCartQuantity,
  deleteCartItem,
  clearCart
} = require('./Controller/Cart.Controller');

// Add to Cart
router.post('/addToCart', addToCart);

// Get Cart Items
router.get('/cart/getItems', getCartItems);

// Update Cart Item Quantity
router.put('/cart/updateQuantity/:id', updateCartQuantity);

// Delete Cart Item
router.delete('/cart/deleteItem/:id', deleteCartItem);

// Clear Cart (Optional)
router.delete('/cart/clear', clearCart);

module.exports = router;

