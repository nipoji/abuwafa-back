// report-routes.js
const express = require('express');
const {
  createReport,
  getReport,
  listReports
} = require('./reportControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.post('/report', verifyToken, createReport);
router.get('/report/:reportId', verifyToken, getReport);
router.get('/reports', verifyToken, listReports);

module.exports = {
  routes: router
};
