const mongoose = require('mongoose');

const OrderItemSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const OrdersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    items: {
        type: [OrderItemSchema],
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shipping: {
        type: Number,
        required: true,
        default: 50,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    cartId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const OrdersModel = mongoose.model('orders', OrdersSchema);
module.exports = OrdersModel;

