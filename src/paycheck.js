// paycheck.js
const db = require('../database/db');

class Paycheck {
  constructor(id_paycheck, id_tutor, tutor_name, month, status, file) {
    this.id = id_paycheck; // Optional manual ID
    this.id_tutor = id_tutor;
    this.tutor_name = tutor_name;
    this.month = month;
    this.status = status;
    this.file = file;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO paychecks ( id_tutor, tutor_name, month, status, file)
       VALUES ( ?, ?, ?, ?, ?)`,
      [ this.id_tutor, this.tutor_name, this.month, this.status, this.file]
    );
    if (!this.id) {
      this.id = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async get(paycheckId) {
    const [rows] = await db.execute(
      `SELECT * FROM paychecks WHERE id_paycheck = ?`,
      [paycheckId]
    );
    return rows[0] || null;
  }

  static async listByTutor(tutorId) {
    const [rows] = await db.execute(
      `SELECT * FROM paychecks WHERE id_tutor = ? ORDER BY month DESC`,
      [tutorId]
    );
    return rows;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM paychecks ORDER BY month DESC`
    );
    return rows;
  }

  static async update(paycheckId, updates) {
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(paycheckId);

    await db.execute(
      `UPDATE paychecks SET ${fields} WHERE id_paycheck = ?`,
      values
    );
  }

  static async delete(paycheckId) {
    await db.execute(
      `DELETE FROM paychecks WHERE id_paycheck = ?`,
      [paycheckId]
    );
  }
}

module.exports = Paycheck;