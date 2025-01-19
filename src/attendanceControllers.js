// attendanceControllers.js
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const Attendance = require("./attendance");
const dotenv = require("dotenv");

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadImageToGCS = async (file) => {
  const { originalname, buffer } = file;
  const filePath = `attendance_images/${Date.now()}-${originalname}`; // Structured file path
  const blob = storage.bucket(bucketName).file(filePath);
  const stream = blob.createWriteStream({
    resumable: false,
  });

  stream.end(buffer);

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return filePath; // Return structured file path
};

const createAttendance = async (req, res) => {
  try {
    const {
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
      topic,
      result,
      attendance_status,
    } = req.body;

    if (
      !id_schedule || !tutor_name || !id_tutor || !student_name || !id_student || 
      !time || !date || !session || !method || !subject || !id_subject || !topic || !attendance_status
    ) {
      return res.status(400).send({
        error: true,
        message: "All fields except id_attendance and image are required",
      });
    }

    let image = null;
    if (req.file) {
      image = await uploadImageToGCS(req.file); // Get structured file path
    }

    const attendance = new Attendance(
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
      image, // Save the structured file path
      topic,
      result,
      attendance_status
    );
    await attendance.save();

    return res.status(201).send({
      error: false,
      message: "Attendance created successfully",
      id: attendance.id_attendance,
    });
  } catch (error) {
    console.error("Error creating attendance:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const generateAttendancesBySession = async (req, res) => {
  try {
    const {
      id_attendance,
      id_schedule,
      tutor_name,
      id_tutor,
      student_name,
      id_student,
      date,
      session,
      method,
      subject,
      id_subject,
      image,
      topic,
      result,
      attendance_status,
    } = req.body;

    if (!session || session <= 0) {
      return res.status(400).send({
        error: true,
        message: "Number of sessions must be greater than zero",
      });
    }

    const attendances = [];
    let currentDate = new Date(date); // Start from given date

    for (let i = 0; i < session; i++) {
      const attendance = new Attendance(
        null, // id_attendance
        id_schedule,
        tutor_name,
        id_tutor,
        student_name,
        id_student,
        "", // time
        "", // ISO Date string
        `${i + 1}`, // session
        method, // method (default value)
        subject, // subject (default value)
        id_subject,
        null, // image
        "", // topic (placeholder)
        "", // result
        "Absent" // attendance_status (default)
      );

      if (attendance.save) await attendance.save(); // Save if save method exists
      attendances.push(attendance);

      // Increment date for next session (assumes sessions are weekly)
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return res.status(201).send({
      error: false,
      message: "Attendances generated successfully",
      attendances,
    });
  } catch (error) {
    console.error("Error generating attendances:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const listAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.list();
    return res.send({
      error: false,
      message: "Attendances fetched successfully",
      attendances,
    });
  } catch (error) {
    console.error("Error listing attendances:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const listAttendancesByTutor = async (req, res) => {
  try {
    const { id_tutor } = req.params;

    if (!id_tutor) {
      return res.status(400).send({
        error: true,
        message: "id_tutor is required",
      });
    }

    const attendances = await Attendance.listByTutor(id_tutor);

    return res.send({
      error: false,
      message: "Attendances fetched successfully",
      attendances,
    });
  } catch (error) {
    console.error("Error listing attendances by tutor:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};
const getAttendanceById = async (req, res) => {
  try {
    const { id_attendance } = req.params;

    if (!id_attendance) {
      return res.status(400).send({
        error: true,
        message: "id_attendance is required",
      });
    }

    const attendance = await Attendance.getById(id_attendance);

    if (!attendance) {
      return res.status(404).send({
        error: true,
        message: "Attendance not found",
      });
    }

    return res.send({
      error: false,
      message: "Attendance fetched successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance by id:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id_attendance } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.image = await uploadImageToGCS(req.file);
    }

    const [result] = await Attendance.update(id_attendance, updates);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        error: true,
        message: "Attendance not found",
      });
    }

    return res.send({
      error: false,
      message: "Attendance updated successfully",
    });
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createAttendance,
  generateAttendancesBySession,
  listAttendances,
  listAttendancesByTutor,
  getAttendanceById,
  updateAttendance,
};
