// scheduleControllers.js
const Schedule = require("./schedule");
const db = require("../database/db");

const createSchedule = async (req, res) => {
  try {
    const {
      id_schedule,
      student_name,
      tutor_name,
      day,
      date,
      id_subject,
      time,
      method,
      link,
      curriculum,
      time_duration,
      total_session,
    } = req.body;

    if (
      !student_name ||
      !tutor_name ||
      !day ||
      !date ||
      !id_subject ||
      !time ||
      !method ||
      !time_duration ||
      !total_session
    ) {
      return res.status(400).send({
        error: true,
        message: "All fields except link and id_schedule are required",
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

    // Find id_tutor based on tutor_name
    const [tutorResult] = await db.execute(
      `SELECT id_tutor FROM tutors WHERE tutor_name = ?`,
      [tutor_name]
    );
    if (tutorResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Tutor '${tutor_name}' not found` });
    }
    const id_tutor = tutorResult[0].id_tutor;

    // Mengambil subject berdasarkan id_subject
    const [subjectResult] = await db.execute(
      `SELECT subject FROM subjects WHERE id_subject = ?`,
      [id_subject]
    );
    if (subjectResult.length === 0) {
      return res
        .status(404)
        .send({
          error: true,
          message: `Subject with ID '${id_subject}' not found`,
        });
    }
    const subject = subjectResult[0].subject;

    // Mengambil grade otomatis berdasar id_student
    const [gradeResult] = await db.execute(
      `SELECT grade FROM students WHERE id_student = ?`,
      [id_student]
    );
    if (gradeResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Student ID '${id_student}' not found` });
    }
    const grade = gradeResult[0].grade;

    // Create a new schedule
    const schedule = new Schedule(
      id_schedule,
      student_name,
      id_student,
      tutor_name,
      id_tutor,
      day,
      date,
      subject,
      id_subject,
      time,
      method,
      link,
      curriculum,
      grade,
      time_duration,
      total_session
    );
    await schedule.save();

    return res.status(201).send({
      error: false,
      message: "Schedule created successfully",
      id: schedule.id,
    });
  } catch (error) {
    console.error("Error creating schedule:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const listSchedules = async (req, res) => {
  try {
    const { tutorId, studentId } = req.query;

    let schedules;

    if (tutorId) {
      schedules = await Schedule.listByTutor(tutorId);
    } else if (studentId) {
      schedules = await Schedule.listByStudent(studentId);
    } else {
      schedules = await Schedule.list();
    }

    return res.send({
      error: false,
      message: "Schedules fetched successfully",
      schedules,
    });
  } catch (error) {
    console.error("Error listing schedules:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    await Schedule.update(scheduleId, updates);
    return res.send({ error: false, message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    await Schedule.delete(scheduleId);
    return res.send({ error: false, message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createSchedule,
  listSchedules,
  updateSchedule,
  deleteSchedule,
};
