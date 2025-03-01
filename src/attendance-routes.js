// attendance-routes.js
const express = require("express");
const {
  createAttendance,
  listAttendances,
  listAttendancesByTutor,
  updateAttendance,
  generateAttendancesBySession,
  listAttendancesByIdSchedule,
  getAttendanceById,
  listDistinctStudentsAndSubjects,
  getAttendanceForCurrentMonthByIdStudent,
} = require("./attendanceControllers");
const { verifyToken } = require("./verifyToken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/attendance",
  verifyToken,
  upload.single("image"),
  createAttendance
);
router.post(
  "/attendance/create/:id_schedule",
  verifyToken,
  generateAttendancesBySession
);
router.get("/attendances", verifyToken, listAttendances);
router.get(
  "/attendances/distinct",
  verifyToken,
  listDistinctStudentsAndSubjects
);
router.get("/attendance/:id_tutor", verifyToken, listAttendancesByTutor);
router.get(
  "/attendance/schedule/:id_schedule",
  verifyToken,
  listAttendancesByIdSchedule
);
router.get(
  "/attendance/generate/:id_student",
  verifyToken,
  getAttendanceForCurrentMonthByIdStudent
);
router.get("/attendance/detail/:id_attendance", verifyToken, getAttendanceById);
// router.put("/attendance/:id_attendance", verifyToken, updateAttendance);
router.put(
  "/attendance/:id_attendance",
  verifyToken,
  upload.single("image"),
  updateAttendance
);

module.exports = {
  routes: router,
};