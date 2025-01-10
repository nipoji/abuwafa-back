// monthlyReport.js
const pdf = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const { Storage } = require('@google-cloud/storage');
require("dotenv").config();

const storage = new Storage({
  keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = process.env.REPORT_BUCKET;

const uploadToGCS = async (filePath, destination) => {
  await storage.bucket(bucketName).upload(filePath, {
    destination,
    gzip: true,
  });
  console.log(`Uploaded ${filePath} to ${bucketName}/${destination}`);
};

const generatePDF = (reportData, outputPath) => {
  const doc = new pdf();
  doc.pipe(fs.createWriteStream(outputPath));

  // Header
  doc.fontSize(20).text(`${reportData.month} Report ${reportData.year}`, 50, 50);
  doc.image('../assets/abuwafa-logo.png', 450, 30, { width: 100 });

  doc.fontSize(12)
    .text(`NAME: ${reportData.student_name} (${reportData.id_student})`, 50, 120)
    .text(`SUBJECT / LEVEL: ${reportData.subject} & ${reportData.level}`, 50, 140);

  doc.moveTo(50, 160).lineTo(550, 160).stroke();

  // Table header
  doc.fontSize(10).text('DATE', 50, 180).text('SUBJECT', 100, 180).text('TUTOR', 200, 180).text('TOPIC', 300, 180).text('RESULT', 400, 180);

  // Table content
  let y = 200;
  reportData.records.forEach(record => {
    doc.text(record.date, 50, y)
      .text(record.subject, 100, y)
      .text(record.tutor_name, 200, y)
      .text(record.topic, 300, y)
      .text(record.result, 400, y);
    y += 20;
  });

  doc.end();
};

const generateMonthlyReports = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  db.query('SELECT * FROM schedules WHERE MONTH(date) = ? AND YEAR(date) = ?', [currentMonth, currentYear], (err, results) => {
    if (err) throw err;

    const studentData = {};

    results.forEach(row => {
      if (!studentData[row.id_student]) {
        studentData[row.id_student] = {
          student_name: row.student_name,
          id_student: row.id_student,
          subject: row.curriculum,
          level: row.grade,
          records: [],
        };
      }

      studentData[row.id_student].records.push({
        date: row.date,
        subject: row.subject,
        tutor_name: row.tutor_name,
        topic: row.topic,
        result: row.result,
      });
    });

    Object.values(studentData).forEach(async (reportData) => {
        const outputPath = path.join(__dirname, 'reports', `${reportData.id_student}_${currentMonth}_${currentYear}.pdf`);
        const gcsPath = `reports/${reportData.id_student}_${currentMonth}_${currentYear}.pdf`;
  
        generatePDF({
          ...reportData,
          month: new Date().toLocaleString('default', { month: 'long' }),
          year: currentYear,
        }, outputPath);
  
        await uploadToGCS(outputPath, gcsPath);

        const id_monthlyReport = `${reportData.id_student}_${currentMonth}_${currentYear}`;
        const id_student = reportData.id_student;
  
        db.query('INSERT INTO monthly_report (id_monthlyReport, id_student, student_name, month, file) VALUES (?, ?, ?, ?, ?)', [
            id_monthlyReport,
            id_student,
          reportData.student_name,
          `${currentMonth}-${currentYear}`,
          gcsPath,
        ]);
      });
    });
  };

  const testGenerateReports = (intervalMinutes) => {
    setInterval(() => {
      console.log('Generating test reports...');
      generateMonthlyReports();
    }, intervalMinutes * 60 * 1000);
  };
  
  module.exports = { generatePDF, generateMonthlyReports, testGenerateReports };