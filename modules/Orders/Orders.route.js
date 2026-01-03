const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
} = require('./Controller/Orders.Controller');
const ensureDBConnection = require('../../middleware/dbConnection');

// Create Order (Checkout)
router.post('/order/checkout', ensureDBConnection, createOrder);

// Get All Orders
router.get('/order/getAll', ensureDBConnection, getAllOrders);

// Get Order By ID
router.get('/order/getById/:id', ensureDBConnection, getOrderById);

// Update Order Status
router.put('/order/updateStatus/:id', ensureDBConnection, updateOrderStatus);

// Delete Order
router.delete('/order/delete/:id', ensureDBConnection, deleteOrder);

module.exports = router;

