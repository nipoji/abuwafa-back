// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

const caPemPath = './ca.pem';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(caPemPath),
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;