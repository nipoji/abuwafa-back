// attendance.js
const db = require('../database/db');

class Attendance {
  constructor(id_attendance, tutor_name, id_tutor, student_name, time, date, session, method, subject, image, topic, result, attendance_status) {
    this.id_attendance = id_attendance; // Optional manual ID
    this.tutor_name = tutor_name;
    this.id_tutor = id_tutor;
    this.student_name = student_name;
    this.time = time;
    this.date = date;
    this.session = session;
    this.method = method;
    this.subject = subject;
    this.image = image;
    this.topic = topic;
    this.result = result;
    this.attendance_status = attendance_status;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO attendance (id_attendance, tutor_name, id_tutor, student_name, time, date, session, method, subject, image, topic, result, attendance_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [this.id_attendance, this.tutor_name, this.id_tutor, this.student_name, this.time, this.date, this.session, this.method, this.subject, this.image, this.topic, this.result, this.attendance_status]
    );
    if (!this.id_attendance) {
      this.id_attendance = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM attendance ORDER BY date ASC, time ASC`
    );
    return rows;
  }

  static async update(id_attendance, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
  
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    values.push(id_attendance);
  
    return db.execute(
      `UPDATE attendance SET ${setClause} WHERE id_attendance = ?`,
      values
    );
  }
  
}

module.exports = Attendance;