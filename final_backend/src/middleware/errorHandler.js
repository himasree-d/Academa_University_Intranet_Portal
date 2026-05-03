const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is ' + (process.env.MAX_FILE_SIZE / (1024 * 1024)) + 'MB'
      });
    }
  
    // Multer file type error
    if (err.message === 'File type not allowed') {
      return res.status(400).json({
        success: false,
        message: 'File type not allowed'
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
  
    // Database errors
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry already exists'
      });
    }
  
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({
        success: false,
        message: 'Referenced record does not exist'
      });
    }
  
    // Default error
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  };
  
  module.exports = errorHandler;