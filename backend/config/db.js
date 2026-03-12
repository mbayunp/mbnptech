// backend/config/db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test Koneksi
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error koneksi ke MySQL:', err.message);
  } else {
    console.log(`✅ Database terhubung: ${process.env.DB_NAME}`);
    connection.release();
  }
});

module.exports = db;