// monthlyReportController.js
const path = require('path');
const db = require('../database/db');
const { Storage } = require('@google-cloud/storage');
require("dotenv").config();

const storage = new Storage({
  keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = process.env.REPORT_BUCKET;

const getMonthlyReport = (req, res) => {
  const reportId = req.params.id;

  db.query('SELECT * FROM monthly_report WHERE id = ?', [reportId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Report not found');

    const gcsPath = results[0].file;
    const fileStream = storage.bucket(bucketName).file(gcsPath).createReadStream();

    res.setHeader('Content-Disposition', `attachment; filename="${gcsPath.split('/').pop()}"`);
    fileStream.pipe(res);
  });
};

module.exports = { getMonthlyReport };