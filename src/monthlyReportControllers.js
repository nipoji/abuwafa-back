// // monthlyReportControllers.js
const MonthlyReport = require('./monthlyReportGet');
const db = require('../database/db');

const createMonthlyReport = async (req, res) => {
  try {
    const { id_monthlyReport, student_name, month, year, file_path } = req.body;

    if (!student_name || !month || !year) {
      return res.status(400).send({
        error: true,
        message: 'Fields student_name, month, and year are required'
      });
    }

    // Find id_student based on student_name
    const [studentResult] = await db.execute(`SELECT id_student FROM students WHERE student_name = ?`, [student_name]);
    if (studentResult.length === 0) {
      return res.status(404).send({ error: true, message: `Student '${student_name}' not found` });
    }
    const id_student = studentResult[0].id_student;

    // Create a new monthly report
    const monthlyReport = new MonthlyReport(id_monthlyReport, id_student, student_name, month, year, file_path);
    await monthlyReport.save();

    return res.status(201).send({
      error: false,
      message: 'Monthly report created successfully',
      id: monthlyReport.id
    });
  } catch (error) {
    console.error("Error creating monthly report:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
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
      message: 'Monthly reports fetched successfully',
      reports
    });
  } catch (error) {
    console.error("Error listing monthly reports:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const updateMonthlyReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const updates = req.body;

    await MonthlyReport.update(reportId, updates);
    return res.send({ error: false, message: 'Monthly report updated successfully' });
  } catch (error) {
    console.error("Error updating monthly report:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const deleteMonthlyReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await MonthlyReport.delete(reportId);
    return res.send({ error: false, message: 'Monthly report deleted successfully' });
  } catch (error) {
    console.error("Error deleting monthly report:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  createMonthlyReport,
  listMonthlyReports,
  updateMonthlyReport,
  deleteMonthlyReport
};
