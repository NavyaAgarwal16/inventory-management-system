const mongoose = require('mongoose');

const dispatchProductSchema =

  new mongoose.Schema({

    productName: {

      type: String,

      required: true

    },

    productId: {

      type: String,

      required: true

    },

    receiverName: {

      type: String,

      required: true

    },

    receiverId: {

      type: String,

      required: true

    },

    quantity: {

      type: Number,

      required: true

    },

    amount: {

      type: Number,

      required: true

    },

    totalCost: {

      type: Number,

      required: true

    },

    stockStatus: {

      type: String,

      required: true

    },

    dispatchDate: {

      type: Date,

      default: Date.now

    }
    ,
    sellingTotalCost: {

      type: Number,

      default: 0

    },

    profitLossAmount: {

      type: Number,

      default: 0

    },

    isProfit: {

      type: Boolean,

      default: false

    },

    newCostPerUnit: {

      type: Number,

      default: 0

    },



  });

module.exports = mongoose.model(

  'DispatchProduct',

  dispatchProductSchema

);

