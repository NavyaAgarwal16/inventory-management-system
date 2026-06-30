const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const authMiddleware = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization || '';

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {

      return res.status(401).json({

        success: false,
        message: 'No token provided'

      });

    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({

      success: false,
      message: 'Invalid or expired token'

    });

  }

};

module.exports = authMiddleware;