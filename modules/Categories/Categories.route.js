const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('./Controller/Categories.Controller');
const { uploadCategory } = require('../../middleware/upload');
const ensureDBConnection = require('../../middleware/dbConnection');

// Create Category
router.post('/addCategory', ensureDBConnection, uploadCategory.single('image'), createCategory);

// Get All Categories
router.get('/category/getAll', ensureDBConnection, getAllCategories);

// Get Category By ID
router.get('/category/getById/:id', ensureDBConnection, getCategoryById);

// Update Category
router.put('/updateCategory/:id', ensureDBConnection, uploadCategory.single('image'), updateCategory);

// Delete Category
router.delete('/deleteCategory/:id', ensureDBConnection, deleteCategory);

module.exports = router;

