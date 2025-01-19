// subject.js
const db = require("../database/db");

class Subject {
  constructor(id_subject, subject, description) {
    this.id = id_subject; // Optional manual ID
    this.subject = subject;
    this.description = description;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO subjects (id_subject, subject, description)
       VALUES (?, ?, ?)`,
      [this.id, this.subject, this.description]
    );
    if (!this.id) {
      this.id = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async get(subjectId) {
    const [rows] = await db.execute(
      `SELECT * FROM subjects WHERE id_subject = ?`,
      [subjectId]
    );
    return rows[0] || null;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM subjects ORDER BY subject ASC`
    );
    return rows;
  }

  static async update(subjectId, updates) {
    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(subjectId);

    await db.execute(
      `UPDATE subjects SET ${fields} WHERE id_subject = ?`,
      values
    );
  }

  static async delete(subjectId) {
    await db.execute(`DELETE FROM subjects WHERE id_subject = ?`, [subjectId]);
  }
}

module.exports = Subject;
