const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const { connectDB } = require('./lib/db');
const app = express();

// Manual CORS headers middleware (runs before everything)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// CORS configuration - Allow all origins (backup)
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Note: Vercel has a 4.5MB body size limit, so we set limits accordingly
app.use(express.json({ limit: '4.5mb' }));
app.use(express.urlencoded({ extended: true, limit: '4.5mb' }));

const { CategoriesRouter, ProductsRouter, CartRouter, OrdersRouter } = require('./routes/route');

app.use('/api/categories', CategoriesRouter);
app.use('/api/products', ProductsRouter);
app.use('/api', CartRouter);
app.use('/api', OrdersRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// 404 handler
app.use((req, res) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler to ensure CORS headers are always set (must be last)
app.use((err, req, res, next) => {
  // Set CORS headers even on errors
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  console.error('Error:', err);

  // Handle payload too large errors (413)
  if (err.status === 413 || err.type === 'entity.too.large' || err.message?.includes('too large')) {
    return res.status(413).json({
      message: 'Request payload too large. Maximum request size is 4.5MB. Please reduce the number or size of images.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB connection - initialize on startup
if (process.env.MONGO_URL) {
  connectDB().catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
      console.error('⚠️ Continuing without database connection (development mode)');
    }
  });
} else {
  console.error('❌ MongoDB connection error: MONGO_URL environment variable is not set');
}

// Export for Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}