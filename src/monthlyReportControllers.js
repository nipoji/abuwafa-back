// monthlyReportControllers.js
const MonthlyReport = require("./monthlyReportGet");
const db = require("../database/db");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

const createMonthlyReport = async (req, res) => {
  try {
    const { id_student, month, year } = req.body;

    // Check if file was uploaded - correct way to check
    if (!req.file) {
      return res.status(400).send({
        error: true,
        message: "PDF file is required",
      });
    }

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
        message: "Fields id_student, month, and year are required",
      });
    }

    // Find student_name based on id_student
    const [studentResult] = await db.execute(
      `SELECT student_name FROM students WHERE id_student = ?`,
      [id_student]
    );
    if (studentResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Student '${id_student}' not found` });
    }
    const student_name = studentResult[0].student_name;

    let file_path = null;
    if (req.file) {
      const { originalname, buffer } = req.file;
      const filePath = `monthly_reports/${Date.now()}-${originalname}`;
      const blob = storage.bucket(bucketName).file(filePath);
      const stream = blob.createWriteStream({ resumable: false });

      stream.end(buffer);

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      file_path = filePath;
    }

    const monthlyReport = new MonthlyReport(
      null,
      id_student,
      student_name,
      month,
      year,
      file_path
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

    const montrep = await MonthlyReport.get(id_monthlyReport);
    if (!montrep) {
      return res.status(404).send({
        error: true,
        message: "Monthly report not found",
      });
    }

    const filePath = montrep.file_path;
    if (!filePath) {
      return res.status(400).send({
        error: true,
        message: "File path not found for the monthly report",
      });
    }

    const file = storage.bucket(bucketName).file(filePath);
    const fileExists = await file.exists();

    if (!fileExists[0]) {
      return res.status(404).send({
        error: true,
        message: "File not found in storage",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(filePath)}`
    );

    file
      .createReadStream()
      .on("error", (err) => {
        console.error("File download error:", err);
        res.status(500).send({
          error: true,
          message: "Error downloading file",
        });
      })
      .pipe(res);
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

    if (!userId || !month || !year) {
      return res.status(400).send({
        error: true,
        message: "Fields userId, month, and year are required",
      });
    }

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
    const { id_student } = req.params;

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

    if (req.file) {
      const { originalname, buffer } = req.file;
      const filePath = `monthly_reports/${Date.now()}-${originalname}`;
      const blob = storage.bucket(bucketName).file(filePath);
      const stream = blob.createWriteStream({ resumable: false });

      stream.end(buffer);

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      updates.file_path = filePath;
    }

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
  downloadMonthlyReport,
  checkReportExistence,
  listMonthlyReportsByStudentId,
};
