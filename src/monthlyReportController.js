// monthlyReportController.js
const path = require('path');
const db = require('../database/db');
const { Storage } = require('@google-cloud/storage');
require("dotenv").config();

const storage = new Storage({
  keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = process.env.GCS_BUCKET_NAME;

const getMonthlyReport = (req, res) => {
  const reportId = req.params.id;

  db.query('SELECT * FROM monthly_report WHERE id = ?', [reportId], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length === 0) return res.status(404).send('Report not found');

    const gcsPath = results[0].file;
    const fileStream = storage.bucket(bucketName).file(gcsPath).createReadStream();

    res.setHeader('Content-Disposition', `attachment; filename="${gcsPath.split('/').pop()}"`);
    fileStream.pipe(res);
  });
};

module.exports = { getMonthlyReport };