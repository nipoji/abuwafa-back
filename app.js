"use strict";

const express = require("express");
const userRoutes = require("./src/user-routes");
const reportRoutes = require("./src/report-routes");
const studentProfileRoutes = require("./src/profile-student-routes");
const tutorProfileRoutes = require("./src/profile-tutor-routes");
const adminProfileRoutes = require("./src/profile-admin-routes");
const scheduleRoutes = require("./src/schedule-routes"); // Added schedule routes
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
app.use("/api", reportRoutes.routes);
app.use("/api", scheduleRoutes.routes); // Added schedule route handling

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
