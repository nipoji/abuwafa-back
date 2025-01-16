// File: monthlyReport-routes.js
const express = require("express");
const { createMonthlyReport, listMonthlyReports, updateMonthlyReport, deleteMonthlyReport } = require("./monthlyReportControllers");
const { verifyToken } = require('./verifyToken');
const router = express.Router();

router.post("/monthlyreports", verifyToken, createMonthlyReport);
router.get("/monthlyreports", verifyToken, listMonthlyReports);
router.put("/monthlyreports/:reportId", verifyToken, updateMonthlyReport);
router.delete("/monthlyreports/:reportId", verifyToken, deleteMonthlyReport);

module.exports = {
  routes: router
};