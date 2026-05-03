require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now to fix the "Load Failed" error
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Test database connection endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connected successfully!', 
      time: result.rows[0].now,
      database: process.env.DB_NAME,
      environment: process.env.NODE_ENV
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// API Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Academa API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      assignments: '/api/assignments',
      submissions: '/api/submissions',
      grades: '/api/grades',
      announcements: '/api/announcements',
      materials: '/api/materials',
      chat: '/api/chat',
      dashboard: '/api/dashboard'
    }
  });
});

// Health check endpoint (no prefix)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});

// Use all routes (mounted at /api by routes index)
app.use('/', routes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const http = require('http');
const socketManager = require('./config/socket');

const server = http.createServer(app);

// Initialize Socket.io
socketManager.init(server);

// Start server
server.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`🚀 Academa Server Started`);
  console.log(`=================================`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DB_NAME}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🔍 Test: http://localhost:${PORT}/api/test`);
  console.log(`💓 Health: http://localhost:${PORT}/health`);
  console.log(`=================================\n`);
});

module.exports = app;