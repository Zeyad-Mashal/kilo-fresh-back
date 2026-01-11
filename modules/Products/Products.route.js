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
const ensureDBConnection = require('../../middleware/dbConnection');

// Create Product
router.post('/addProduct', ensureDBConnection, uploadProducts.array('images', 10), createProduct);

// Get All Products
router.get('/product/getAll', ensureDBConnection, getAllProducts);

// Search Products
router.get('/product/search', ensureDBConnection, searchProducts);

// Get All Offered Products
router.get('/product/offers', ensureDBConnection, getAllOfferedProducts);

// Get Products By Category
router.get('/product/getByCategory/:categoryId', ensureDBConnection, getProductsByCategory);

// Get Product By ID
router.get('/product/:id', ensureDBConnection, getProductById);

// Update Product
router.put('/updateProduct/:id', ensureDBConnection, uploadProducts.array('images', 10), updateProduct);

// Delete Product
router.delete('/deleteProduct/:id', ensureDBConnection, deleteProduct);

module.exports = router;

