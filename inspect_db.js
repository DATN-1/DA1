const mysql = require('mysql2/promise');

async function main() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'datn' });
  const [rows] = await pool.query("SHOW TABLES");
  console.log("Tables:", rows);
  
  if (rows.some(r => Object.values(r)[0] === 'order_items')) {
     const [cols] = await pool.query("DESCRIBE order_items");
     console.log("order_items schema:", cols);
  } else if (rows.some(r => Object.values(r)[0] === 'order_details')) {
     const [cols] = await pool.query("DESCRIBE order_details");
     console.log("order_details schema:", cols);
  }
  pool.end();
}
main();
