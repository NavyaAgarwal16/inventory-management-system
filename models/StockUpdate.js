const mongoose = require('mongoose');

const stockUpdateSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },

    productId: {
        type: String,
        required: true
    },

    amount: {
        type: Number
    },

    lowStockLimit: {
        type: Number
    },

    stockBefore: {
        type: Number,
        required: true
    },

    operation: {
        type: String,
        enum: ['add', 'reduce'],
        required: true
    },

    quantityChanged: {
        type: Number,
        required: true
    },

    stockAfter: {
        type: Number,
        required: true
    },

    reason: {
        type: String
    },

    stockStatus: {
        type: String
    },

    action: {
        type: String,
        default: 'Stock Updated'
    },


    updatedBy: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('StockUpdate', stockUpdateSchema);