const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllOfferedProducts,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('./Controller/Products.Controller');
const { uploadProducts } = require('../../middleware/upload');

// Create Product
router.post('/addProduct', uploadProducts.array('images', 10), createProduct);

// Get All Products
router.get('/product/getAll', getAllProducts);

// Search Products
router.get('/product/search', searchProducts);

// Get All Offered Products
router.get('/product/offers', getAllOfferedProducts);

// Get Products By Category
router.get('/product/getByCategory/:categoryId', getProductsByCategory);

// Get Product By ID
router.get('/product/getById/:id', getProductById);

// Update Product
router.put('/updateProduct/:id', uploadProducts.array('images', 10), updateProduct);

// Delete Product
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;

