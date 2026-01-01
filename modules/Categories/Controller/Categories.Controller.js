const CategoriesModel = require('../../../DB/Models/Categories.model');
const cloudinary = require('../../../config/cloudinary');

// Create Category
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Check if category with same name already exists
    const existingCategory = await CategoriesModel.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new CategoriesModel({
      name: name.trim(),
      image: {
        url: req.file.path,
        public_id: req.file.filename
      }
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// Get All Categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoriesModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Get Category By ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await CategoriesModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category retrieved successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await CategoriesModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If name is provided, check if it's unique
    if (name && name.trim() !== category.name) {
      const existingCategory = await CategoriesModel.findOne({ name: name.trim() });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
      category.name = name.trim();
    }

    // If new image is provided, delete old image and update
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.image && category.image.public_id) {
        try {
          await cloudinary.uploader.destroy(category.image.public_id);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      category.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await CategoriesModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete image from Cloudinary
    if (category.image && category.image.public_id) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    await CategoriesModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

