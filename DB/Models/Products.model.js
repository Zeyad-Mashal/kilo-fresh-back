const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        }
    ],
    name: {
        type: String,
        required: true,
        trim: true
    },
    priceBefore: {
        type: Number,
        required: true,
        min: 0
    },
    priceAfter: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    isOffer: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ProductsModel = mongoose.model('products', ProductsSchema);
module.exports = ProductsModel;

