// schedule.js
const db = require('../database/db');

class Schedule {
  constructor(id_schedule, student_name, id_student, tutor_name, id_tutor, day, date, subject, id_subject, time, method, link, curriculum, grade, time_duration, total_session) {
    this.id = id_schedule; // Optional manual ID
    this.student_name = student_name;
    this.id_student = id_student;
    this.tutor_name = tutor_name;
    this.id_tutor = id_tutor;
    this.day = day;
    this.date = date;
    this.subject = subject;
    this.id_subject = id_subject;
    this.time = time;
    this.method = method;
    this.link = link;
    this.curriculum = curriculum;
    this.grade = grade;
    this.time_duration = time_duration;
    this.total_session = total_session;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO schedules (id_schedule, student_name, id_student, tutor_name, id_tutor, day, date, subject, id_subject, time, method, link, curriculum, grade, time_duration, total_session)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [this.id, this.student_name, this.id_student, this.tutor_name, this.id_tutor, this.day, this.date, this.subject, this.id_subject, this.time, this.method, this.link, this.curriculum, this.grade, this.time_duration, this.total_session]
    );
    if (!this.id) {
      this.id = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async get(scheduleId) {
    const [rows] = await db.execute(
      `SELECT * FROM schedules WHERE id_schedule = ?`,
      [scheduleId]
    );
    return rows[0] || null;
  }

  static async listByTutor(tutorId) {
    const [rows] = await db.execute(
      `SELECT * FROM schedules WHERE id_tutor = ? ORDER BY date ASC, time ASC`,
      [tutorId]
    );
    return rows;
  }

  static async listByStudent(studentId) {
    const [rows] = await db.execute(
      `SELECT * FROM schedules WHERE id_student = ? ORDER BY date ASC, time ASC`,
      [studentId]
    );
    return rows;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT * FROM schedules ORDER BY date ASC, time ASC`
    );
    return rows;
  }

  static async update(scheduleId, updates) {
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(scheduleId);

    await db.execute(
      `UPDATE schedules SET ${fields} WHERE id_schedule = ?`,
      values
    );
  }

  static async delete(scheduleId) {
    await db.execute(
      `DELETE FROM schedules WHERE id_schedule = ?`,
      [scheduleId]
    );
  }
}

module.exports = Schedule;