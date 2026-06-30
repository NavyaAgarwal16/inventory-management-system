const express = require('express');

const router = express.Router();

const DispatchProduct =

  require('../models/DispatchProduct');
const { sendError } = require('../utils/apiResponse');

/* ─── ADD DISPATCH PRODUCT ─── */

router.post(

  '/add-dispatch-product',

  async (req, res) => {

    try {

      const { productName, productId, receiverName, receiverId, quantity, amount, totalCost } = req.body;

      if (!productName || !productId || !receiverName || !receiverId || quantity == null || amount == null || totalCost == null) {

        return sendError(res, 400, 'productName, productId, receiverName, receiverId, quantity, amount, and totalCost are required');

      }

      const dispatchProduct =

        new DispatchProduct({

          productName:

            req.body.productName,

          productId:

            req.body.productId,

          receiverName:

            req.body.receiverName,

          receiverId:

            req.body.receiverId,

          quantity:

            req.body.quantity,

          amount:

            req.body.amount,

          totalCost:

            req.body.totalCost,

          stockStatus:

            req.body.stockStatus,

          profitLossAmount:

            req.body.profitLossAmount,

          sellingTotalCost:

            req.body.sellingTotalCost


        });

      await dispatchProduct.save();

      return res.status(201).json({

        success: true,

        product: dispatchProduct

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);

/* ─── GET ALL DISPATCH PRODUCTS ─── */

router.get(

  '/all-dispatch-products',

  async (req, res) => {

    try {

      const products =

        await DispatchProduct.find()

          .sort({

            dispatchDate: -1

          });

      return res.status(200).json({

        success: true,

        products

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);

module.exports = router;
