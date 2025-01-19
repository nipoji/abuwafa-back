// attendance.js
const db = require("../database/db");

class Attendance {
  constructor(
    id_attendance,
    id_schedule,
    tutor_name,
    id_tutor,
    student_name,
    id_student,
    time,
    date,
    session,
    method,
    subject,
    id_subject,
    image,
    topic,
    result,
    attendance_status
  ) {
    this.id_attendance = id_attendance; // Optional manual ID
    this.id_schedule = id_schedule;
    this.tutor_name = tutor_name;
    this.id_tutor = id_tutor;
    this.student_name = student_name;
    this.id_student = id_student;
    this.time = time;
    this.date = date;
    this.session = session;
    this.method = method;
    this.subject = subject;
    this.id_subject = id_subject;
    this.image = image;
    this.topic = topic;
    this.result = result;
    this.attendance_status = attendance_status;
  }

  async save() {
    const [result] = await db.execute(
      `INSERT INTO attendance 
      (id_attendance, id_schedule, tutor_name, id_tutor, student_name, id_student, time, date, session, 
      method, subject, id_subject, image, topic, result, attendance_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.id_attendance,
        this.id_schedule,
        this.tutor_name,
        this.id_tutor,
        this.student_name,
        this.id_student,
        this.time,
        this.date,
        this.session,
        this.method,
        this.subject,
        this.id_subject,
        this.image,
        this.topic,
        this.result,
        this.attendance_status,
      ]
    );
    if (!this.id_attendance) {
      this.id_attendance = result.insertId; // Use auto-generated ID if not provided
    }
    return this;
  }

  static async list() {
    const [rows] = await db.execute(
      `SELECT attendance.*, schedules.tutor_name, schedules.student_name, schedules.subject, schedules.id_subject 
       FROM attendance 
       JOIN schedules ON attendance.id_schedule = schedules.id_schedule 
       ORDER BY attendance.date ASC, attendance.time ASC`
    );
    return rows;
  }

  static async listByTutor(id_tutor) {
    const [rows] = await db.execute(
      `SELECT attendance.*, schedules.tutor_name, schedules.student_name, schedules.subject, schedules.id_subject 
       FROM attendance 
       JOIN schedules ON attendance.id_schedule = schedules.id_schedule 
       WHERE attendance.id_tutor = ? 
       ORDER BY attendance.date ASC, attendance.time ASC`,
      [id_tutor]
    );
    return rows;
  }

  static async listByTutorAndStudent(id_tutor, id_student) {
    const [rows] = await db.execute(
      `SELECT attendance.*, schedules.tutor_name, schedules.student_name, schedules.subject, schedules.id_subject 
       FROM attendance 
       JOIN schedules ON attendance.id_schedule = schedules.id_schedule 
       WHERE attendance.id_tutor = ? AND attendance.id_student = ? 
       ORDER BY attendance.date ASC, attendance.time ASC`,
      [id_tutor, id_student]
    );
    return rows;
  }

  static async update(id_attendance, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    values.push(id_attendance);

    return db.execute(
      `UPDATE attendance SET ${setClause} WHERE id_attendance = ?`,
      values
    );
  }

  static async listByIdSchedule(id_schedule) {
    const [rows] = await db.execute(
      `SELECT attendance.*, schedules.tutor_name, schedules.student_name, schedules.subject, schedules.id_subject 
       FROM attendance 
       JOIN schedules ON attendance.id_schedule = schedules.id_schedule 
       WHERE attendance.id_schedule = ? 
       ORDER BY attendance.date ASC, attendance.time ASC`,
      [id_schedule]
    );
    return rows;
  }

  static async listDistinctStudentsAndSubjects() {
    const [rows] = await db.execute(
      `SELECT DISTINCT id_schedule, student_name, subject
      FROM attendance`
    );
    return rows;
  }

  static async getById(id_attendance) {
    const [rows] = await db.execute(
      `SELECT attendance.*, schedules.tutor_name, schedules.student_name, schedules.subject, schedules.id_subject 
       FROM attendance 
       JOIN schedules ON attendance.id_schedule = schedules.id_schedule 
       WHERE attendance.id_attendance = ?`,
      [id_attendance]
    );
    return rows[0];
  }

  static async getAttendanceByIdStudentForCurrentMonth(id_student) {
    const [rows] = await db.execute(
      `
        SELECT 
        id_student,
        student_name,
        date, 
        subject, 
        tutor_name, 
        topic, 
        result 
      FROM attendance 
      WHERE id_student = ? 
        AND MONTH(date) = MONTH(CURDATE()) 
        AND YEAR(date) = YEAR(CURDATE())
      ORDER BY subject ASC, date ASC
      `,
      [id_student]
    );
    return rows;
  }
}

module.exports = Attendance;
