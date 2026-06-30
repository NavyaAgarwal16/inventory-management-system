require('dotenv').config();

const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const connectDB = require('./config/database');

const productRoutes = require('./routes/product');

const rawMaterialRoutes = require('./routes/raw-material');

const stockUpdateRoutes = require('./routes/stockUpdate');

const dispatchProductRoutes =

  require('./routes/dispatch-product');

const app = express();

const PORT = process.env.PORT || 3000;

/* ─── Connect MongoDB ─── */

connectDB();

/* ─── Middleware ─── */

app.use(cors({

  origin:

    process.env.FRONTEND_URL ||

    'http://localhost:4200',

  credentials: true,

  methods: [

    'GET',

    'POST',

    'PUT',

    'DELETE',

    'OPTIONS'

  ],

  allowedHeaders: [

    'Content-Type',

    'Authorization'

  ]

}));

app.use(express.json());

app.use(express.urlencoded({

  extended: true

}));

if (

  process.env.NODE_ENV !==

  'production'

) {

  app.use(morgan('dev'));

}

/* ─── Routes ─── */

app.use(

  '/api/product',

  productRoutes

);

app.use(

  '/api/raw-materials',

  rawMaterialRoutes

);

app.use(

  '/api/dispatch-products',

  dispatchProductRoutes

);

app.use(
  '/api/stock-update',
  stockUpdateRoutes
);


app.use(

  '/api/auth',

  require('./routes/auth')

);

/* ─── Health Check ─── */

app.get(

  '/api/health',

  (req, res) => {

    res.json({

      success: true,

      message:

        'Server is running',

      timestamp:

        new Date()

    });

  }

);

/* ─── 404 Handler ─── */

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: 'Route not found'

  });

});

/* ─── Global Error Handler ─── */

app.use((

  err,

  req,

  res,

  next

) => {

  console.error(err.stack);

  res.status(500).json({

    success: false,

    message:

      process.env.NODE_ENV ===

        'production'

        ? 'Internal server error'

        : err.message

  });

});

/* ─── Start Server ─── */

app.listen(PORT, () => {

  console.log(

    `🚀 Server running on http://localhost:${PORT}`

  );

  console.log(

    `📁 Environment: ${process.env.NODE_ENV ||

    'development'

    }`

  );

});
