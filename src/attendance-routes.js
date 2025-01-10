// attendance-routes.js
const express = require('express');
const {
  createAttendance,
  listAttendances,
  updateAttendance
} = require('./attendanceControllers');
const { verifyToken } = require('./verifyToken');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/attendance', verifyToken, upload.single('image'), createAttendance);
router.get('/attendances', verifyToken, listAttendances);
router.put('/attendance/:id_attendance', verifyToken, upload.single('image'), updateAttendance);

module.exports = {
  routes: router
};