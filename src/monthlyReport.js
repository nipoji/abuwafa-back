const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const db = require("../database/db");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage"); // Import the Google Cloud Storage client
const storage = new Storage(); // Initialize the client
const bucketName = process.env.GCS_BUCKET_NAME; // Replace with your bucket name

async function generateMonthlyReport(id_student) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let currentY = margin;

  const logoPath = path.resolve(__dirname, "../assets/abuwafalogo.png");

  try {
    // Load logo image
    const img = await loadImage(logoPath);
    const imgWidth = img.width;
    const imgHeight = img.height;

    const canvas = createCanvas(imgWidth, imgHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    const base64Image = canvas.toDataURL("image/png");

    // Query student and report details
    const [studentDetails] = await db.query(
      `SELECT 
        student_name, 
        id_student, 
        curriculum, 
        grade, 
        DATE_FORMAT(date, '%M') AS month, 
        DATE_FORMAT(date, '%Y') AS year 
      FROM schedules 
      WHERE id_student = ?`,
      [id_student]
    );

    if (!studentDetails || studentDetails.length === 0) {
      throw new Error(`Student with ID ${id_student} not found`);
    }

    const { student_name, curriculum, grade, month, year } = studentDetails[0];

    // Add header text and logo
    const maxHeaderHeight = 15;
    const headerImageWidth = (maxHeaderHeight / imgHeight) * imgWidth;
    const headerImageHeight = maxHeaderHeight;
    const headerImageX = pageWidth - margin - headerImageWidth;
    const headerVerticalCenter = currentY + maxHeaderHeight / 2;

    doc.setFontSize(18).setTextColor(40).setFont("helvetica", "bold");
    doc.text(`${month} Report ${year}`, margin, headerVerticalCenter + 2);
    doc.addImage(
      base64Image,
      "PNG",
      headerImageX,
      headerVerticalCenter - headerImageHeight / 2,
      headerImageWidth,
      headerImageHeight
    );

    currentY += maxHeaderHeight + 4;
    doc.setDrawColor(0).setLineWidth(0.5).line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    // Add personal details
    doc.setFontSize(12).setFont("helvetica", "normal");
    const personalLeft = `NAME: ${student_name} (${id_student})`;
    const personalRight = `SUBJECT / LEVEL: ${curriculum} & ${grade}`;
    doc.text(personalLeft, margin, currentY);
    doc.text(personalRight, pageWidth - margin - doc.getTextWidth(personalRight), currentY);
    currentY += 5;

    // Fetch attendance data
    const [attendanceData] = await db.query(
      "SELECT DATE_FORMAT(date, '%a %b %d %Y') AS date, subject, tutor_name, topic, result FROM attendance WHERE id_student = ?",
      [id_student]
    );

    // Add attendance table
    doc.autoTable({
      startY: currentY,
      head: [["DATE", "SUB", "TUTOR", "TOPIC", "RESULT"]],
      body: attendanceData.map((row) => [
        row.date,
        row.subject,
        row.tutor_name,
        row.topic,
        row.result,
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 60, halign: "center" },
        4: { cellWidth: 60, halign: "center" },
      },
      headStyles: { fillColor: [235, 124, 90], halign: "center" },
    });

    // Save PDF to buffer
    const pdfBuffer = doc.output("arraybuffer");

    // Generate a unique filename for the report
    const fileName = `Monthly_Report_${student_name}_${month}_${year}.pdf`;
    const filePath = `monthly_reports/${fileName}`; // Structured file path

    // Upload to Google Cloud Storage
    const file = storage.bucket(bucketName).file(filePath);
    await file.save(Buffer.from(pdfBuffer));

    // Save the relative file path in the database
    await db.query(
      "INSERT INTO monthly_reports (id_student, student_name, month, year, file_path) VALUES (?, ?, ?, ?, ?)",
      [id_student, student_name, month, year, fileName]
    );

    console.log(`Report generated and uploaded to: ${fileName}`);
    return fileName;
  } catch (err) {
    console.error("Error generating report:", err);
    throw err;
  }
}

async function generateMonthlyReportsForAllStudents() {
  try {
    const [studentsWithoutReports] = await db.query(`
      SELECT DISTINCT a.id_student, s.student_name 
      FROM attendance a
      JOIN students s ON a.id_student = s.id_student
      LEFT JOIN monthly_reports mr 
        ON a.id_student = mr.id_student 
        AND mr.month = MONTH(CURDATE()) 
        AND mr.year = YEAR(CURDATE())
      WHERE mr.id_monthlyReport IS NULL
    `);

    for (const student of studentsWithoutReports) {
      await generateMonthlyReport(student.id_student);
    }

    console.log("All pending reports have been generated.");
  } catch (err) {
    console.error("Error generating monthly reports:", err);
  }
}

module.exports = { generateMonthlyReport, generateMonthlyReportsForAllStudents };
