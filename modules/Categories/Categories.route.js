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

// Create Category
router.post('/addCategory', uploadCategory.single('image'), createCategory);

// Get All Categories
router.get('/category/getAll', getAllCategories);

// Get Category By ID
router.get('/category/getById/:id', getCategoryById);

// Update Category
router.put('/updateCategory/:id', uploadCategory.single('image'), updateCategory);

// Delete Category
router.delete('/deleteCategory/:id', deleteCategory);

module.exports = router;

