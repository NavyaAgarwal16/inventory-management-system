const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  productName: {

    type: String,

  },

  productId: {

    type: String,
    required: true,
    unique: true

  },

  quantity: {

    type: Number,
    required: true

  },

  lowStockLimit: {

    type: Number,
    default: 20

  },

  amount: {

    type: Number,
    required: true

  },

  totalCost: {

    type: Number

  },

  image: {

    type: String

  },

  stockStatus: {

    type: String,
    default: 'In Stock'

  },

  itemStatus: {
    type: String,
    default: 'Active'
  },

  lastUpdatedBy: {
    type: String
  },

  description: {
    type: String,
    required: true,
    maxlength: 1000
  },

  rawMaterialsUsed: [
    {
      rawMaterialName: String,
      rawMaterialId: String,
      quantityUsedPerProduct: Number
    }
  ],


}, {

  timestamps: true

});

module.exports =
  mongoose.model('Product', productSchema);