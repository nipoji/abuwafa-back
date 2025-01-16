const db = require('../database/db');

class MonthlyReport {
  constructor(id_monthlyReport, id_student, student_name, month, year, file_path) {
    this.id = id_monthlyReport;
    this.id_student = id_student;
    this.student_name = student_name;
    this.month = month;
    this.year = year;
    this.file_path = file_path;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO monthly_reports (id_monthlyReport, id_student, student_name, month, year, file_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [this.id, this.id_student, this.student_name, this.month, this.year, this.file_path]
    );
    if (!this.id) {
      this.id = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async get(reportId) {
    const [rows] = await db.execute(
      `SELECT * FROM monthly_reports WHERE id_monthlyReport = ?`,
      [reportId]
    );
    return rows[0] || null;
  }

  static async listByStudent(studentId) {
    const [rows] = await db.execute(
      `SELECT * FROM monthly_reports WHERE id_student = ? ORDER BY year DESC, month DESC`,
      [studentId]
    );
    return rows;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM monthly_reports ORDER BY year DESC, month DESC`
    );
    return rows;
  }

  static async update(reportId, updates) {
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(reportId);

    await db.execute(
      `UPDATE monthly_reports SET ${fields} WHERE id_monthlyReport = ?`,
      values
    );
  }

  static async delete(reportId) {
    await db.execute(
      `DELETE FROM monthly_reports WHERE id_monthlyReport = ?`,
      [reportId]
    );
  }
}

module.exports = MonthlyReport;