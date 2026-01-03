const { ensureConnection } = require('../lib/db');

// Middleware to ensure MongoDB connection is ready before handling requests
const ensureDBConnection = async (req, res, next) => {
  try {
    const isConnected = await ensureConnection();
    
    if (!isConnected) {
      return res.status(503).json({
        message: 'Database connection unavailable. Please try again later.',
        error: 'Database connection timeout'
      });
    }
    
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    return res.status(503).json({
      message: 'Database connection error. Please try again later.',
      error: error.message
    });
  }
};

module.exports = ensureDBConnection;

