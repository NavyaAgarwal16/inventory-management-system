const router =

  require('express').Router();

const RawMaterial =

  require('../models/RawMaterial');
const { sendError } = require('../utils/apiResponse');


// ADD RAW MATERIAL

router.post(

  '/add-raw-material',

  async (req, res) => {

    try {

      const { rawMaterialName, rawMaterialId, quantity, amount } = req.body;

      if (!rawMaterialName || !rawMaterialId || quantity == null || amount == null) {

        return sendError(res, 400, 'rawMaterialName, rawMaterialId, quantity, and amount are required');

      }

      const rawMaterial =

        new RawMaterial(req.body);

      await rawMaterial.save();

      return res.status(201).json({

        success: true,

        message:

          'Raw Material Added',

        rawMaterial

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);


// GET ALL RAW MATERIALS

router.get(

  '/all-raw-materials',

  async (req, res) => {

    try {

      const rawMaterials =

        await RawMaterial.find();

      return res.status(200).json({

        success: true,

        rawMaterials

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);


// DELETE RAW MATERIAL

router.delete(

  '/delete-raw-material/:id',

  async (req, res) => {

    try {

      await RawMaterial.findByIdAndDelete(

        req.params.id

      );

      return res.status(200).json({

        success: true,

        message:

          'Raw Material Deleted'

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);


// UPDATE RAW MATERIAL

router.put(

  '/update-raw-material/:id',

  async (req, res) => {

    try {

      const updatedRawMaterial =

        await RawMaterial.findByIdAndUpdate(

          req.params.id,

          req.body,

          { new: true }

        );

      return res.status(200).json({

        success: true,

        message:

          'Raw Material Updated',

        updatedRawMaterial

      });

    }

    catch (error) {

      return sendError(res, 500, error.message);

    }

  }

);

module.exports = router;