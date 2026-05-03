const { Pool } = require('pg');

const SUPABASE_URL = 'postgresql://postgres.aiucznsyjaubfpjjlebd:ewgfehbvrhy4eye@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString: SUPABASE_URL,
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