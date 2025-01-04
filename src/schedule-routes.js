// schedule-routes.js
const express = require('express');
const {
  createSchedule,
  getSchedule,
  listSchedules,
  updateSchedule,
  deleteSchedule
} = require('./scheduleControllers'); // Pastikan file dan path benar
const { verifyToken } = require('./verifyToken'); // Pastikan file dan path benar

const router = express.Router();

router.post('/schedule', verifyToken, createSchedule);
router.get('/schedules', verifyToken, listSchedules);
router.put('/schedule/:scheduleId', verifyToken, updateSchedule);
router.delete('/schedule/:scheduleId', verifyToken, deleteSchedule);

module.exports = {
  routes: router
};