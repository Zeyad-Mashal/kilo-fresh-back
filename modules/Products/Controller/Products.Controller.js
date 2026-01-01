const ProductsModel = require('../../../DB/Models/Products.model');
const CategoriesModel = require('../../../DB/Models/Categories.model');
const cloudinary = require('../../../config/cloudinary');

// Create Product
const createProduct = async (req, res, next) => {
  try {
    const { name, priceBefore, priceAfter, description, category, isOffer } = req.body;

    if (!name || !priceBefore || !priceAfter || !description || !category) {
      return res.status(400).json({ message: 'Name, priceBefore, priceAfter, description, and category are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Check if category exists
    const categoryExists = await CategoriesModel.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Process images
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const product = new ProductsModel({
      name: name.trim(),
      priceBefore: parseFloat(priceBefore),
      priceAfter: parseFloat(priceAfter),
      description: description.trim(),
      category: category,
      isOffer: isOffer === 'true' || isOffer === true,
      images: images
    });

    await product.save();
    await product.populate('category', 'name image');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Get All Products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductsModel.find()
      .populate('category', 'name image')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Products retrieved successfully',
      products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
};

// Get Product By ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductsModel.findById(id)
      .populate('category', 'name image');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Get Products By Category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await CategoriesModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await ProductsModel.find({ category: categoryId })
      .populate('category', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Products retrieved successfully',
      category: {
        _id: category._id,
        name: category.name,
        image: category.image
      },
      products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
};

// Get All Offered Products
const getAllOfferedProducts = async (req, res, next) => {
  try {
    const products = await ProductsModel.find({ isOffer: true })
      .populate('category', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Offered products retrieved successfully',
      products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
};

// Update Product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, priceBefore, priceAfter, description, category, isOffer } = req.body;

    const product = await ProductsModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields if provided
    if (name) product.name = name.trim();
    if (priceBefore) product.priceBefore = parseFloat(priceBefore);
    if (priceAfter) product.priceAfter = parseFloat(priceAfter);
    if (description) product.description = description.trim();
    if (isOffer !== undefined) product.isOffer = isOffer === 'true' || isOffer === true;

    // Update category if provided
    if (category) {
      const categoryExists = await CategoriesModel.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
      product.category = category;
    }

    // Update images if new ones are provided
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
      }

      // Add new images
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      product.images = newImages;
    }

    await product.save();
    await product.populate('category', 'name image');

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductsModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await cloudinary.uploader.destroy(image.public_id);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    await ProductsModel.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Search Products
const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create case-insensitive regex for partial matching
    const searchRegex = new RegExp(query.trim(), 'i');

    // Search in name and description fields
    const products = await ProductsModel.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    })
      .populate('category', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Search completed successfully',
      query: query.trim(),
      products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllOfferedProducts,
  updateProduct,
  deleteProduct,
  searchProducts
};

