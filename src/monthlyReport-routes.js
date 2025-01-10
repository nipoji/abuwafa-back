// monthlyReport-routes.js
const express = require('express');
const { getMonthlyReport } = require('./monthlyReportController');

const router = express.Router();

router.get('report/:id', getMonthlyReport);

module.exports = router;