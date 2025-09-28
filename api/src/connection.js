import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL do Neon
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
