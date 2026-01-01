const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
} = require('./Controller/Orders.Controller');

// Create Order (Checkout)
router.post('/order/checkout', createOrder);

// Get All Orders
router.get('/order/getAll', getAllOrders);

// Get Order By ID
router.get('/order/getById/:id', getOrderById);

// Update Order Status
router.put('/order/updateStatus/:id', updateOrderStatus);

// Delete Order
router.delete('/order/delete/:id', deleteOrder);

module.exports = router;

