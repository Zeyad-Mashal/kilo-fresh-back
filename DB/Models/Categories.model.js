const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema({
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

const CategoriesModel = mongoose.model('categories', CategoriesSchema);
module.exports = CategoriesModel;

