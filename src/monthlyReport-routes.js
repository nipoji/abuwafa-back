// File: monthlyReport-routes.js
const express = require("express");
const { createMonthlyReport, listMonthlyReports, updateMonthlyReport, deleteMonthlyReport,
  downloadMonthlyReport,
  checkReportExistence,
  listMonthlyReportsByStudentId
 } = require("./monthlyReportControllers");
const { verifyToken } = require('./verifyToken');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/monthlyreports", verifyToken, upload.single("file"), createMonthlyReport);
router.get("/monthlyreports", verifyToken, listMonthlyReports);
router.put("/monthlyreports/:reportId", verifyToken, updateMonthlyReport);
router.delete("/monthlyreports/:reportId", verifyToken, deleteMonthlyReport);
router.get(
  "/monthlyreport/check/:userId/:month/:year",
  verifyToken,
  checkReportExistence
);
router.get(
  "/monthlyreports/download/:id_monthlyReport",
  verifyToken,
  downloadMonthlyReport
);
router.get(
  "/monthlyreport/detail/:id_student",
  verifyToken,
  listMonthlyReportsByStudentId
);

module.exports = {
  routes: router
};