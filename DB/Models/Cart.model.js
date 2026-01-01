const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    cartId: {
        type: String,
        required: true,
        index: true
    }
}, { timestamps: true });

const CartModel = mongoose.model('cart', CartSchema);
module.exports = CartModel;

