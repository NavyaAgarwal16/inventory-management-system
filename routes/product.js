const router = require('express').Router();

const Product = require('../models/Product');
const { sendError } = require('../utils/apiResponse');


// ADD PRODUCT

router.post('/add-product', async (req, res) => {

  try {

    const { productName, productId, quantity, amount } = req.body;

    if (!productName || !productId || quantity == null || amount == null) {

      return sendError(res, 400, 'productName, productId, quantity, and amount are required');

    }

    const product = new Product(req.body);

    await product.save();

    return res.status(201).json({

      success: true,
      message: 'Product Added',
      product

    });

  }

  catch (error) {

    return sendError(res, 500, error.message);

  }

});


// GET ALL PRODUCTS

router.get('/all-products', async (req, res) => {

  try {

    const products =
      await Product.find();

    return res.status(200).json({

      success: true,
      products

    });

  }

  catch (error) {

    return sendError(res, 500, error.message);

  }

});

// UPDATE PRODUCT

router.put('/update-product/:id', async (req, res) => {

  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    res.status(200).json({

      success: true,
      message: 'Product Updated',
      updatedProduct

    });

  }

  catch (error) {

    return sendError(res, 500, error.message);

  }

});


const StockUpdate = require('../models/StockUpdate'); // ← add at top

// ADD STOCK UPDATE
router.post('/add-stock-update', async (req, res) => {

  try {

    const {
      productName,
      productId,
      stockBefore,
      operation,
      quantityChanged,
      stockAfter
    } = req.body;

    if (
      !productName ||
      !productId ||
      stockBefore == null ||
      !operation ||
      quantityChanged == null ||
      stockAfter == null
    ) {
      return sendError(res, 400, 'Required fields missing');
    }

    const stockUpdate = new StockUpdate(req.body);

    await stockUpdate.save();

    return res.status(201).json({
      success: true,
      message: 'Stock Update Record Saved',
      stockUpdate
    });

  }

  catch (error) {
    return sendError(res, 500, error.message);
  }

});


// GET ALL STOCK UPDATES
router.get('/all-stock-updates', async (req, res) => {

  try {

    const stockUpdates = await StockUpdate
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      stockUpdates
    });

  }

  catch (error) {
    return sendError(res, 500, error.message);
  }

});

module.exports = router;