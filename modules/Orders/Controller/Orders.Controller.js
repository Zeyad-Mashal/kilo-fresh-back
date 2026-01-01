const OrdersModel = require('../../../DB/Models/Orders.model');
const CartModel = require('../../../DB/Models/Cart.model');
const ProductsModel = require('../../../DB/Models/Products.model');

// Create Order (Checkout)
const createOrder = async (req, res, next) => {
  try {
    const { name, phone, address, cartId, shipping } = req.body;

    if (!name || !phone || !address || !cartId) {
      return res.status(400).json({ 
        message: 'Name, phone, address, and cartId are required' 
      });
    }

    // Get cart items
    const cartItems = await CartModel.find({ cartId: cartId })
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name image'
        }
      });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order items and calculate subtotal
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cartItems) {
      if (!cartItem.product) {
        continue; // Skip if product was deleted
      }

      const itemPrice = cartItem.product.priceAfter * cartItem.quantity;
      subtotal += itemPrice;

      orderItems.push({
        productName: cartItem.product.name,
        productId: cartItem.product._id,
        quantity: cartItem.quantity,
        price: itemPrice
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    // Calculate shipping and total
    const shippingCost = shipping ? parseFloat(shipping) : 50; // Default 50 EGP
    const total = subtotal + shippingCost;

    // Create order
    const order = new OrdersModel({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: orderItems,
      subtotal: subtotal,
      shipping: shippingCost,
      total: total,
      cartId: cartId,
      status: 'pending'
    });

    await order.save();

    // Clear cart after order is created
    await CartModel.deleteMany({ cartId: cartId });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        _id: order._id,
        name: order.name,
        phone: order.phone,
        address: order.address,
        items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrdersModel.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders,
      count: orders.length
    });
  } catch (error) {
    next(error);
  }
};

// Get Order By ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrdersModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Delete Order
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrdersModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await OrdersModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status (Bonus)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Valid status is required (pending, processing, completed, cancelled)' 
      });
    }

    const order = await OrdersModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
};

