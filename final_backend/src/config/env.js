module.exports = {
    // Server
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // Database
    DB: {
      USER: process.env.DB_USER || 'himasree',
      HOST: process.env.DB_HOST || 'localhost',
      NAME: process.env.DB_NAME || 'academa',
      PASSWORD: process.env.DB_PASSWORD || '',
      PORT: process.env.DB_PORT || 5432,
    },
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    
    // File Upload
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,zip').split(','),
  };