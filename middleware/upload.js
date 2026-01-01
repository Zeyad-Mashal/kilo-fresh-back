const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storageCategories = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Categories",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const uploadCategory = multer({ 
  storage: storageCategories,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB per file
    files: 1 // Max 1 file for category image
  }
});

const storageProducts = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const uploadProducts = multer({ 
  storage: storageProducts,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB per file
    files: 10 // Max 10 files for product images
  }
});

module.exports = { uploadCategory, uploadProducts };