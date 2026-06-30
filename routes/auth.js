const nodemailer = require('nodemailer');

const router = require('express').Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const authMiddleware = require('../middleware/auth');
const { sendError } = require('../utils/apiResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

let storedOtp = '';

// REGISTER ROUTE

router.post('/register', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {

      return sendError(res, 400, 'All fields are required');

    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: 'User already exists'

      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword

    });

    return res.status(201).json({

      success: true,
      message: 'User registered successfully',
      user

    });

  } catch (error) {

    return sendError(res, 500, error.message);

  }

});


// LOGIN ROUTE

router.post('/login', async (req, res) => {


  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return sendError(res, 400, 'User Not Found');

    }



    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return sendError(res, 400, 'Wrong Password');


    }


    const token = jwt.sign(

      { id: user._id },

      JWT_SECRET,

      { expiresIn: '1d' }

    );

    return res.status(200).json({

      success: true,
      message: 'Login successful',
      token,
      user

    });

  } catch (error) {

    return sendError(res, 500, error.message);

  }

});


// PROTECTED PROFILE ROUTE

router.get('/profile', authMiddleware, (req, res) => {

  return res.status(200).json({

    success: true,
    message: 'Protected profile accessed',

    user: req.user

  });

});

router.post('/send-otp', async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return sendError(res, 400, 'Email is required');

    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {

      return sendError(res, 500, 'Email service is not configured');

    }

    storedOtp =
      Math.floor(100000 + Math.random() * 900000)
        .toString();

    const transporter =
      nodemailer.createTransport({

        service: 'gmail',

        auth: {

          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS

        }

      });

    // SEND EMAIL
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: 'OTP Verification',

      text: `Your OTP is ${storedOtp}`

    });

    return res.status(200).json({

      success: true,
      message: 'OTP Sent'

    });

  }

  catch (error) {

    return sendError(res, 500, error.message);

  }

});


// VERIFY OTP ROUTE

router.post('/verify-otp', async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      otp
    } = req.body;

    // WRONG OTP
    if (otp !== storedOtp) {

      return sendError(res, 400, 'Invalid OTP');

    }

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: 'User already exists'

      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({

      name,
      email,
      password: hashedPassword

    });

    return res.status(201).json({

      success: true,
      message: 'Registration Successful',
      user

    });

  }

  catch (error) {

    return sendError(res, 500, error.message);

  }

});


module.exports = router;