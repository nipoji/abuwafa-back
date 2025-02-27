// invoice.js
const db = require('../database/db');

class Invoice {
  constructor(id_invoice, id_student, student_name, month, file, status) {
    this.id = id_invoice; // Optional manual ID
    this.id_student = id_student;
    this.student_name = student_name;
    this.month = month;
    this.file = file;
    this.status = status;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO invoices ( id_student, student_name, month, file, status)
       VALUES ( ?, ?, ?, ?, ?)`,
      [ this.id_student, this.student_name, this.month, this.file, this.status]
    );
    if (!this.id) {
      this.id = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async get(invoiceId) {
    const [rows] = await db.execute(
      `SELECT * FROM invoices WHERE id_invoice = ?`,
      [invoiceId]
    );
    return rows[0] || null;
  }

  static async listByStudent(studentId) {
    const [rows] = await db.execute(
      `SELECT * FROM invoices WHERE id_student = ? ORDER BY month DESC`,
      [studentId]
    );
    return rows;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM invoices ORDER BY month DESC`
    );
    return rows;
  }

  static async update(invoiceId, updates) {
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(invoiceId);

    await db.execute(
      `UPDATE invoices SET ${fields} WHERE id_invoice = ?`,
      values
    );
  }

  static async delete(invoiceId) {
    await db.execute(
      `DELETE FROM invoices WHERE id_invoice = ?`,
      [invoiceId]
    );
  }
}

module.exports = Invoice;