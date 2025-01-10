// app.js
"use strict";

const express = require("express");
const userRoutes = require("./src/user-routes");
const studentProfileRoutes = require("./src/profile-student-routes");
const tutorProfileRoutes = require("./src/profile-tutor-routes");
const adminProfileRoutes = require("./src/profile-admin-routes");
const scheduleRoutes = require("./src/schedule-routes");
const attendanceRoutes = require("./src/attendance-routes");
const paycheckRoutes = require("./src/paycheck-routes");
const invoiceRoutes = require("./src/invoice-routes");
const monthlyReportRoutes = require("./src/monthlyReport-routes");
const { generateMonthlyReports, testGenerateReports } = require("./src/monthlyReport");
const cors = require("cors"); // CORS middleware for cross-origin requests
const morgan = require("morgan"); // Logging middleware
require("dotenv").config();

const app = express();

// Middleware for CORS
app.use(cors());

// Middleware for request logging
app.use(morgan("dev"));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("This is Abuwafa API");
});

// Authentication and user-related routes
app.use("/auth", userRoutes.routes);

// API routes
app.use("/api", scheduleRoutes.routes);
app.use("/api", attendanceRoutes.routes);
app.use("/api", paycheckRoutes.routes);
app.use("/api", invoiceRoutes.routes);
app.use('/api/', monthlyReportRoutes);
testGenerateReports(1);

// Profile routes
app.use("/api/students", studentProfileRoutes.routes);
app.use("/api/tutors", tutorProfileRoutes.routes);
app.use("/api/admin", adminProfileRoutes.routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).send({
    error: true,
    message: "Route not found",
  });
});

// Port configuration
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});