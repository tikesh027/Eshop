const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    address: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    quantity: {
        type: Schema.Types.Number,
        required: true,
    },
    amount: {
        type: Schema.Types.Number,
        required: true
    }
}, { timestamps: {
    createdAt: 'orderDate'
} });

module.exports = mongoose.model('Order', orderSchema);