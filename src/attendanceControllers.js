// attendanceControllers.js
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const Attendance = require("./attendance");
const dotenv = require("dotenv");

const storage = new Storage({
  keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadImageToGCS = async (file) => {
  const { originalname, buffer } = file;
  const blob = storage.bucket(bucketName).file(Date.now() + "-" + originalname);
  const stream = blob.createWriteStream({
    resumable: false,
  });

  stream.end(buffer);

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return `https://storage.googleapis.com/${bucketName}/${blob.name}`;
};

const createAttendance = async (req, res) => {
  try {
    const {
      id_attendance,
      tutor_name,
      id_tutor,
      student_name,
      id_student,
      time,
      date,
      session,
      method,
      subject,
      topic,
      result,
      attendance_status,
    } = req.body;

    if (
      !tutor_name ||
      !id_tutor ||
      !student_name ||
      !id_student ||
      !time ||
      !date ||
      !session ||
      !method ||
      !subject ||
      !topic ||
      !attendance_status
    ) {
      return res.status(400).send({
        error: true,
        message: "All fields except id_attendance and image are required",
      });
    }

    let image = null;
    if (req.file) {
      image = await uploadImageToGCS(req.file);
    }

    const attendance = new Attendance(
      id_attendance,
      tutor_name,
      id_tutor,
      student_name,
      id_student,
      time,
      date,
      session,
      method,
      subject,
      image,
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
  listAttendances,
  listAttendancesByTutor,
  updateAttendance,
};
