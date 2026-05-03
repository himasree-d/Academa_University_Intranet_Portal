const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONN || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
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