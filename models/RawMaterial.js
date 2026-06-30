const mongoose = require('mongoose');

const rawMaterialSchema =

new mongoose.Schema({

  rawMaterialName: {

    type: String,

  },

  rawMaterialId: {

    type: String,
    required: true,
    unique: true

  },

  quantity: {

    type: Number,
    required: true

  },

  amount: {

    type: Number,
    required: true

  },

  supplierName: {

    type: String

  },

  supplierId: {

    type: String,
    required: true,
    unique: true

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

  lowStockLimit: {

    type: Number,
    default: 20

  },

  inventoryHistory: [

    {

      action: {

        type: String

      },

      quantity: {

        type: Number

      },

      date: {

        type: Date,
        default: Date.now

      }

    }

  ]

}, {

  timestamps: true

});

module.exports =

mongoose.model(

  'RawMaterial',

  rawMaterialSchema

);