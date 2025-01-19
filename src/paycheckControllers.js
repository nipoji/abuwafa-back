// paycheckControllers.js
const Paycheck = require("./paycheck");
const db = require("../database/db");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/paychecks/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Get month and year from the request body
    const month = req.body.month; // Format: "2024-01"
    // Create month abbreviation mapping
    const monthAbbrev = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };
    // Extract year and month from the date string
    const [year, monthNum] = month.split("-");
    const monthShort = monthAbbrev[monthNum];

    // Create filename: Payslip-MonthAbbrev-Year-Timestamp
    const filename = `Payslip_${
      req.body.tutor_name
    }_${monthShort}${year}${path.extname(file.originalname)}`;

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Modify the createPaycheck controller to use multer
const createPaycheck = async (req, res) => {
  try {
    const { tutor_name, month, status } = req.body;
    const file = req.file ? req.file.filename : null; // Get the uploaded filename

    if (!tutor_name || !month || !status) {
      return res.status(400).send({
        error: true,
        message: "Fields tutor_name, month, and status are required",
      });
    }

    // Find id_tutor based on tutor_name
    const [tutorResult] = await db.execute(
      `SELECT id_tutor FROM tutors WHERE tutor_name = ?`,
      [tutor_name]
    );

    if (tutorResult.length === 0) {
      return res.status(404).send({
        error: true,
        message: `Tutor '${tutor_name}' not found`,
      });
    }

    const id_tutor = tutorResult[0].id_tutor;

    // Create a new paycheck
    const paycheck = new Paycheck(
      null, // let database auto-generate id
      id_tutor,
      tutor_name,
      month,
      status,
      file
    );

    await paycheck.save();

    return res.status(201).send({
      error: false,
      message: "Paycheck created successfully",
      id: paycheck.id,
    });
  } catch (error) {
    console.error("Error creating paycheck:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

// const createPaycheck = async (req, res) => {
//   try {
//     const { id_paycheck, tutor_name, month, status, file } = req.body;

//     if (!tutor_name || !month || !status) {
//       return res.status(400).send({
//         error: true,
//         message: 'Fields tutor_name, month, and status are required'
//       });
//     }

//     // Find id_tutor based on tutor_name
//     const [tutorResult] = await db.execute(`SELECT id_tutor FROM tutors WHERE tutor_name = ?`, [tutor_name]);
//     if (tutorResult.length === 0) {
//       return res.status(404).send({ error: true, message: `Tutor '${tutor_name}' not found` });
//     }
//     const id_tutor = tutorResult[0].id_tutor;

//     // Create a new paycheck
//     const paycheck = new Paycheck(id_paycheck, id_tutor, tutor_name, month, status, file);
//     await paycheck.save();

//     return res.status(201).send({
//       error: false,
//       message: 'Paycheck created successfully',
//       id: paycheck.id
//     });
//   } catch (error) {
//     console.error("Error creating paycheck:", error.message);
//     return res.status(500).send({ error: true, message: 'Internal server error' });
//   }
// };

const listPaychecks = async (req, res) => {
  try {
    const { tutorId } = req.query;

    let paychecks;

    if (tutorId) {
      paychecks = await Paycheck.listByTutor(tutorId);
    } else {
      paychecks = await Paycheck.list();
    }

    return res.send({
      error: false,
      message: "Paychecks fetched successfully",
      paychecks,
    });
  } catch (error) {
    console.error("Error listing paychecks:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const downloadPaycheck = async (req, res) => {
  try {
    const { paycheckId } = req.params;

    // Get paycheck info from database
    const paycheck = await Paycheck.get(paycheckId);

    if (!paycheck) {
      return res.status(404).send({
        error: true,
        message: "Paycheck not found",
      });
    }

    // Construct file path
    const filePath = `uploads/paychecks/${paycheck.file}`;

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${paycheck.file}`
    );

    // Send the file
    res.download(filePath, paycheck.file, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send({
          error: true,
          message: "Error downloading file",
        });
      }
    });
  } catch (error) {
    console.error("Error downloading paycheck:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const updatePaycheck = async (req, res) => {
  try {
    const { paycheckId } = req.params;
    const updates = req.body;

    await Paycheck.update(paycheckId, updates);
    return res.send({ error: false, message: "Paycheck updated successfully" });
  } catch (error) {
    console.error("Error updating paycheck:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deletePaycheck = async (req, res) => {
  try {
    const { paycheckId } = req.params;
    await Paycheck.delete(paycheckId);
    return res.send({ error: false, message: "Paycheck deleted successfully" });
  } catch (error) {
    console.error("Error deleting paycheck:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createPaycheck,
  listPaychecks,
  downloadPaycheck,
  updatePaycheck,
  deletePaycheck,
  upload,
};
