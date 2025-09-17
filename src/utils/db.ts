// src/utils/db.ts - Database connection utility
import { Pool } from 'pg';

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'myusta_website_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'myusta_website',
  password: process.env.DB_PASSWORD || 'myusta_secure_password_2024',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Database query helper
export const db = {
  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Database query error', { text, error });
      throw error;
    }
  },

  async getClient() {
    return await pool.connect();
  },

  async close() {
    await pool.end();
  }
};

// Test database connection
export async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default db;
