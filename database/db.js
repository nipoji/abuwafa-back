// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    ca: Buffer.from(process.env.DB_CA, 'utf-8'),
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;