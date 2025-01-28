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

  const fileUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;

  return fileUrl; // Return structured file path
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
      !id_schedule || !id_tutor || !id_student || 
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
      attendance_status,
    } = req.body;

    if (!session || session <= 0) {
      return res.status(400).send({
        error: true,
        message: "Number of sessions must be greater than zero",
      });
    }

    function generateRandomUUID() {
      return Math.floor(Math.random() * 1000000000).toString();
    }

    const attendances = [];
    let currentDate = new Date(date); // Start from given date

    for (let i = 0; i < session; i++) {
      const randomUUID = generateRandomUUID();
      const attendance = new Attendance(
        randomUUID,
        id_schedule,
        tutor_name,
        id_tutor,
        student_name,
        id_student,
        time, // time
        currentDate, // ISO Date string
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

const listAttendancesByIdSchedule = async (req, res) => {
  try {
    const { id_schedule } = req.params;

    if (!id_schedule) {
      return res.status(400).send({
        error: true,

        message: "id_schedule is required",
      });
    }

    const attendances = await Attendance.listByIdSchedule(id_schedule);

    return res.send({
      error: false,

      message: "Attendances fetched successfully",

      attendances,
    });
  } catch (error) {
    console.error("Error listing attendances by schedule:", error.message);

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

const listDistinctStudentsAndSubjects = async (req, res) => {
  try {
    // Kueri untuk mendapatkan student_name dan subject secara distinct

    const result = await Attendance.listDistinctStudentsAndSubjects();

    if (!result || result.length === 0) {
      return res.status(404).send({
        error: true,

        message: "No distinct students and subjects found",
      });
    }

    return res.send({
      error: false,

      message: "Distinct students and subjects fetched successfully",

      data: result, // Pastikan array dikirim tanpa modifikasi
    });
  } catch (error) {
    console.error(
      "Error fetching distinct students and subjects:",

      error.message
    );

    return res

      .status(500)

      .send({ error: true, message: "Internal server error" });
  }
};

const getAttendanceForCurrentMonthByIdStudent = async (req, res) => {
  try {
    const { id_student } = req.params;

    if (!id_student) {
      return res.status(400).send({
        error: true,

        message: "Student ID is required",
      });
    }

    // Fetch attendance data for the current month

    const attendanceData =
      await Attendance.getAttendanceByIdStudentForCurrentMonth(id_student);

    if (attendanceData.length === 0) {
      return res.status(404).send({
        error: false,

        message: "No attendance records found for the current month",

        data: [],
      });
    }

    return res.status(200).send({
      error: false,

      message: "Attendance records fetched successfully",

      data: attendanceData,
    });
  } catch (error) {
    console.error(
      "Error fetching attendance for current month:",

      error.message
    );

    return res.status(500).send({
      error: true,

      message: "Internal server error",
    });
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
  listAttendancesByIdSchedule,
  listDistinctStudentsAndSubjects,
  getAttendanceById,
  getAttendanceForCurrentMonthByIdStudent,
  updateAttendance,
};