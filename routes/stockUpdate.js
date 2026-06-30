const router = require('express').Router();
const StockUpdate = require('../models/StockUpdate');
const { sendError } = require('../utils/apiResponse');

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