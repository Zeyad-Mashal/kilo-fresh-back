const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCartItems,
  updateCartQuantity,
  deleteCartItem,
  clearCart
} = require('./Controller/Cart.Controller');
const ensureDBConnection = require('../../middleware/dbConnection');

// Add to Cart
router.post('/addToCart', ensureDBConnection, addToCart);

// Get Cart Items
router.get('/cart/getItems', ensureDBConnection, getCartItems);

// Update Cart Item Quantity
router.put('/cart/updateQuantity/:id', ensureDBConnection, updateCartQuantity);

// Delete Cart Item
router.delete('/cart/deleteItem/:id', ensureDBConnection, deleteCartItem);

// Clear Cart (Optional)
router.delete('/cart/clear', ensureDBConnection, clearCart);

module.exports = router;

