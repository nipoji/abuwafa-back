// File: monthlyReport-routes.js
const express = require("express");
const {
  createMonthlyReport,
  listMonthlyReports,
  updateMonthlyReport,
  deleteMonthlyReport,
  upload,
  listMonthlyReportsByStudentId,
  downloadMonthlyReport,
  checkReportExistence,
} = require("./monthlyReportControllers");
const { verifyToken } = require("./verifyToken");
const router = express.Router();

router.post(
  "/monthlyreports",
  verifyToken,
  upload.single("file"),
  createMonthlyReport
);
router.get("/monthlyreports", verifyToken, listMonthlyReports);
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
router.put("/monthlyreports/:reportId", verifyToken, updateMonthlyReport);
router.delete("/monthlyreports/:reportId", verifyToken, deleteMonthlyReport);

module.exports = {
  routes: router,
};
