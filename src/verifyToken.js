//verifyToken.js
const jsonToken = require('jsonwebtoken');
const pool = require('../database/db'); // Assuming this is your MySQL database connection
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jsonToken.verify(authHeader, process.env.KEY_JWT, (err, user) => {
      if (err) {
        return res.status(403).json({ error: true, message: "Token is invalid!" });
      }
      req.user = user; // Attaching decoded user info
      next();
    });
  } else {
    return res.status(401).json({ error: true, message: "You are not authenticated!" });
  }
};

const verifyTokenAndAuth = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      // Verify the user exists in the database
      const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [req.user.id]);
      if (rows.length === 0) {
        return res.status(403).json({ error: true, message: "User does not exist!" });
      }

      // Optionally, check roles or other conditions
      if (req.user.id === req.query.id) {
        next();
      } else {
        res.status(403).json({ error: true, message: "You are not allowed!" });
      }
    } catch (error) {
      console.error("Error verifying user:", error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuth
};