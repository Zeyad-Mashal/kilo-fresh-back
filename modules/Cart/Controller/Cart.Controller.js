const CartModel = require('../../../DB/Models/Cart.model');
const ProductsModel = require('../../../DB/Models/Products.model');

// Add to Cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, cartId } = req.body;

    if (!productId || !cartId) {
      return res.status(400).json({ message: 'Product ID and Cart ID are required' });
    }

    const qty = quantity ? parseInt(quantity) : 1;

    if (qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check if product exists
    const product = await ProductsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingCartItem = await CartModel.findOne({
      product: productId,
      cartId: cartId
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      existingCartItem.quantity += qty;
      await existingCartItem.save();
      await existingCartItem.populate('product');

      return res.status(200).json({
        message: 'Cart item quantity updated successfully',
        cartItem: existingCartItem
      });
    }

    // Create new cart item
    const cartItem = new CartModel({
      product: productId,
      quantity: qty,
      cartId: cartId
    });

    await cartItem.save();
    await cartItem.populate({
      path: 'product',
      populate: {
        path: 'category',
        select: 'name image'
      }
    });

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem
    });
  } catch (error) {
    next(error);
  }
};

// Get Cart Items
const getCartItems = async (req, res, next) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({ message: 'Cart ID is required' });
    }

    const cartItems = await CartModel.find({ cartId: cartId })
      .populate({
        path: 'product',
        populate: {
          path: 'category',
          select: 'name image'
        }
      })
      .sort({ createdAt: -1 });

    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      if (item.product) {
        total += item.product.priceAfter * item.quantity;
      }
    });

    res.status(200).json({
      message: 'Cart items retrieved successfully',
      cartItems,
      count: cartItems.length,
      total: total.toFixed(2)
    });
  } catch (error) {
    next(error);
  }
};

// Update Cart Item Quantity
const updateCartQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cartItem = await CartModel.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    await cartItem.populate({
      path: 'product',
      populate: {
        path: 'category',
        select: 'name image'
      }
    });

    res.status(200).json({
      message: 'Cart item quantity updated successfully',
      cartItem
    });
  } catch (error) {
    next(error);
  }
};

// Delete Cart Item
const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cartItem = await CartModel.findById(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await CartModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Cart item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Clear Cart (Optional - delete all items for a cartId)
const clearCart = async (req, res, next) => {
  try {
    const { cartId } = req.query;

    if (!cartId) {
      return res.status(400).json({ message: 'Cart ID is required' });
    }

    await CartModel.deleteMany({ cartId: cartId });

    res.status(200).json({
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartQuantity,
  deleteCartItem,
  clearCart
};

