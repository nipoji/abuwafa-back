// File: monthlyReport.js
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { Storage } = require('@google-cloud/storage');
const db = require('../database/db');

const storage = new Storage({
  keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadToGCS = async (filePath, destination) => {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination,
      gzip: true,
    });
    console.log(`Uploaded ${filePath} to ${bucketName}/${destination}`);
  } catch (err) {
    console.error(`Error uploading to GCS: ${err.message}`);
  }
};

const generatePDF = (reportData, outputPath) => {
  try {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(`${reportData.month} Report ${reportData.year}`, 10, 20);
    const logoPath = path.resolve(__dirname, '../assets/abuwfa-logo.png');
    doc.addImage(logoPath, 'PNG', 170, 10, 20, 20);

    doc.setFontSize(12);
    doc.text(`NAME: ${reportData.student_name} (${reportData.id_student})`, 10, 40);
    doc.text(`SUBJECT / LEVEL: ${reportData.curriculum} & ${reportData.grade}`, 10, 50);

    doc.setLineWidth(0.5);
    doc.line(10, 55, 200, 55);

    // Table header
    doc.setFontSize(10);
    doc.text('DATE', 10, 65);
    doc.text('SUBJECT', 40, 65);
    doc.text('TUTOR', 80, 65);
    doc.text('TOPIC', 120, 65);
    doc.text('RESULT', 160, 65);

    // Table content
    let y = 75;
    reportData.records.forEach(record => {
      doc.text(record.date, 10, y);
      doc.text(record.curriculum, 40, y);
      doc.text(record.tutor_name, 80, y);
      doc.text(record.topic, 120, y);
      doc.text(record.result, 160, y);
      y += 10;
    });

    const pdfBuffer = doc.output('arraybuffer');
    fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
    console.log(`PDF generated at ${outputPath}`);
  } catch (err) {
    console.error(`Error generating PDF: ${err.message}`);
  }
};

const generateMonthlyReports = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  db.query('SELECT * FROM schedules WHERE MONTH(date) = ? AND YEAR(date) = ?', [currentMonth, currentYear], (err, results) => {
    if (err) {
      console.error('Database query error:', err.message);
      return;
    }

    const studentData = {};

    results.forEach(row => {
      if (!studentData[row.id_student]) {
        studentData[row.id_student] = {
          student_name: row.student_name,
          id_student: row.id_student,
          curriculum: row.curriculum,
          grade: row.grade,
          records: [],
        };
      }

      studentData[row.id_student].records.push({
        date: row.date,
        curriculum: row.curriculum,
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
      ], (err) => {
        if (err) {
          console.error('Error inserting report data:', err.message);
        } else {
          console.log(`Report data for ${id_student} inserted successfully.`);
        }
      });
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