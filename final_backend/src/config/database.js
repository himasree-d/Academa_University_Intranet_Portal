const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'himasree',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'academa_lms',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Successfully connected to database');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};