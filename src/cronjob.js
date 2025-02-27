const schedule = require("node-schedule");
const { generateMonthlyReportsForAllStudents } = require("./monthlyReport"); // Import fungsi laporan bulanan

// Jadwal cron job untuk menjalankan setiap awal bulan
// Jika ingin test, ganti menjadi */1 * * * * maka tergenerate otomatis dalam satu menit
schedule.scheduleJob("0 7 */2 * *", async () => {
  console.log("Starting monthly report generation...");
  try {
    await generateMonthlyReportsForAllStudents();
    console.log("Monthly reports generated successfully.");
  } catch (err) {
    console.error("Error generating monthly reports:", err);
  }
});