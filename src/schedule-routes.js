// schedule-routes.js
const express = require('express');
const {
  createSchedule,
  listSchedules,
  updateSchedule,
  deleteSchedule
} = require('./scheduleControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.post('/schedule', verifyToken, createSchedule);
router.get('/schedules', verifyToken, listSchedules);
router.put('/schedule/:scheduleId', verifyToken, updateSchedule);
router.delete('/schedule/:scheduleId', verifyToken, deleteSchedule);

module.exports = {
  routes: router
};