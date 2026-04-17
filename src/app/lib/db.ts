import mysql, { Pool } from 'mysql2/promise';

const globalForDb = globalThis as unknown as { mysqlPool: Pool };

const pool = globalForDb.mysqlPool || mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datn',
  connectionLimit: 10,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mysqlPool = pool;
}

export default pool;
