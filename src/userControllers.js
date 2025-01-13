// userControllers.js
"use strict";

const pool = require("../database/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userLogin = async (req, res) => {
  try {
    const { role, username, password } = req.body;

    if (!role || !username || !password) {
      return res.status(400).send({
        error: true,
        message: "Role, username, and password are required",
      });
    }

    // Determine the table and ID column based on the role
    let tableName, idColumn;
    if (role === "Student") {
      tableName = "students";
      idColumn = "id_student";
    } else if (role === "Tutor") {
      tableName = "tutors";
      idColumn = "id_tutor";
    } else if (role === "Admin") {
      tableName = "admin";
      idColumn = "id_admin";
    } else {
      return res.status(400).send({
        error: true,
        message: "Invalid role",
      });
    }

    // Query the appropriate table
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).send({
        error: true,
        message: "User not found",
      });
    }

    const user = rows[0];

    // Verify the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({
        error: true,
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uid: user[idColumn],
        role: role,
      },
      // { id: user[idColumn], username: user.username, role },
      process.env.KEY_JWT,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );
    // Return all fields from the user object
    res.send({
      error: false,
      message: "Login successful",
      loginResult: {
        ...user, // Spread all fields from the user object
        role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// Admin creates accounts for students and tutors
const createAccount = async (req, res) => {
  try {
    const { role, username, password, ...details } = req.body;

    if (!role || !username || !password) {
      return res.status(400).send({
        error: true,
        message: "Role, username, and password are required",
      });
    }

    // Determine the table based on the role
    let tableName;
    if (role === "Student") tableName = "students";
    else if (role === "Tutor") tableName = "tutors";
    else if (role === "Admin") tableName = "admin";
    else {
      return res.status(400).send({
        error: true,
        message: "Invalid role",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new account into the appropriate table
    const fields = Object.keys(details).join(", ");
    const placeholders = Object.keys(details)
      .map(() => "?")
      .join(", ");
    const values = Object.values(details);

    await pool.query(
      `INSERT INTO ${tableName} (username, password, ${fields}) VALUES (?, ?, ${placeholders})`,
      [username, hashedPassword, ...values]
    );

    res.status(201).send({
      error: false,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Create account error:", error.message);
    res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

module.exports = {
  userLogin,
  createAccount,
};
