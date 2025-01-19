// monthlyReportControllers.js
const MonthlyReport = require("./monthlyReportGet");
const db = require("../database/db");
const multer = require("multer");
const path = require("path");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directory where images will be stored
    cb(null, "uploads/monthly-report/");
  },
  filename: (req, file, cb) => {
    // Use original filename with a timestamp to avoid naming collisions
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const createMonthlyReport = async (req, res) => {
  try {
    const { student_name, month, year } = req.body;

    // Check if file was uploaded - correct way to check
    if (!req.file) {
      return res.status(400).send({
        error: true,
        message: "PDF file is required",
      });
    }

    // Validate other required fields
    if (!student_name || !month || !year) {
      return res.status(400).send({
        error: true,
        message: "Fields student_name, month, and year are required",
      });
    }

    // Find id_student based on student_name
    const [studentResult] = await db.execute(
      `SELECT id_student FROM students WHERE student_name = ?`,
      [student_name]
    );

    if (studentResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Student '${student_name}' not found` });
    }

    const id_student = studentResult[0].id_student;

    // Create a new monthly report with the uploaded file path
    const monthlyReport = new MonthlyReport(
      null,
      id_student,
      student_name,
      month,
      year,
      req.file.filename // Use the uploaded file's filename
    );

    await monthlyReport.save();

    return res.status(201).send({
      error: false,
      message: "Monthly report created successfully",
      id: monthlyReport.id,
      file_path: req.file.filename,
    });
  } catch (error) {
    console.error("Error creating monthly report:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const downloadMonthlyReport = async (req, res) => {
  try {
    const { id_monthlyReport } = req.params;

    // Get paycheck info from database
    const montrep = await MonthlyReport.get(id_monthlyReport);

    if (!montrep) {
      return res.status(404).send({
        error: true,
        message: "Monthly report not found",
      });
    }

    // Construct file path
    const filePath = `uploads/monthly-report/${montrep.file_path}`;

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${montrep.file_path}`
    );

    // Send the file
    res.download(filePath, montrep.file_path, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send({
          error: true,
          message: "Error downloading file",
        });
      }
    });
  } catch (error) {
    console.error("Error downloading monthly report:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const listMonthlyReports = async (req, res) => {
  try {
    const { studentId } = req.query;

    let reports;

    if (studentId) {
      reports = await MonthlyReport.listByStudent(studentId);
    } else {
      reports = await MonthlyReport.list();
    }

    return res.send({
      error: false,
      message: "Monthly reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error listing monthly reports:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const checkReportExistence = async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    // Validate the input
    if (!userId || !month || !year) {
      return res.status(400).send({
        error: true,
        message: "Fields userId, month, and year are required",
      });
    }

    // Check if the report exists
    const exists = await MonthlyReport.checkIfReportExists(userId, month, year);

    return res.send({
      error: false,
      exists,
      message: exists
        ? "Monthly report already exists"
        : "Monthly report does not exist",
    });
  } catch (error) {
    console.error("Error checking report existence:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const listMonthlyReportsByStudentId = async (req, res) => {
  try {
    const { id_student } = req.params; // Get studentId from request parameters

    // Fetch reports from the database for the given studentId
    const reports = await MonthlyReport.listByStudent(id_student);

    if (reports.length === 0) {
      return res.status(404).send({
        error: true,
        message: `No reports found for student ID '${id_student}'`,
      });
    }

    return res.send({
      error: false,
      message: "Monthly reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error listing monthly reports:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateMonthlyReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updates = req.body;

    await MonthlyReport.update(reportId, updates);
    return res.send({
      error: false,
      message: "Monthly report updated successfully",
    });
  } catch (error) {
    console.error("Error updating monthly report:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deleteMonthlyReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await MonthlyReport.delete(reportId);
    return res.send({
      error: false,
      message: "Monthly report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting monthly report:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createMonthlyReport,
  downloadMonthlyReport,
  checkReportExistence,
  listMonthlyReports,
  listMonthlyReportsByStudentId,
  updateMonthlyReport,
  deleteMonthlyReport,
  upload,
};
