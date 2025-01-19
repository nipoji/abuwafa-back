// invoiceControllers.js
const Invoice = require("./invoice");
const db = require("../database/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/invoices/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const month = req.body.month;
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
    const [year, monthNum] = month.split("-");
    const monthShort = monthAbbrev[monthNum];

    const filename = `Invoice_${
      req.body.student_name
    }_${monthShort}_${year}${path.extname(file.originalname)}`;

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const createInvoice = async (req, res) => {
  try {
    const { student_name, month, status } = req.body;
    const file = req.file ? req.file.filename : null; // Get the uploaded filename

    if (!student_name || !month || !status) {
      return res.status(400).send({
        error: true,
        message: "Fields student_name, month, and status are required",
      });
    }

    // Find id_student based on student_name
    const [studentResult] = await db.execute(
      `SELECT id_student FROM students WHERE student_name = ?`,
      [student_name]
    );
    if (studentResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Student '${student_name}' not found` });
    }
    const id_student = studentResult[0].id_student;

    // Create a new invoice
    const invoice = new Invoice(
      "",
      id_student,
      student_name,
      month,
      file,
      status
    );
    await invoice.save();

    return res.status(201).send({
      error: false,
      message: "Invoice created successfully",
      id: invoice.id,
    });
  } catch (error) {
    console.error("Error creating invoice:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const { id_invoice } = req.params;

    // Get paycheck info from database
    const invoice = await Invoice.get(id_invoice);

    if (!invoice) {
      return res.status(404).send({
        error: true,
        message: "Paycheck not found",
      });
    }

    // Construct file path
    const filePath = `uploads/invoices/${invoice.file}`;

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.file}`
    );

    // Send the file
    res.download(filePath, invoice.file, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).send({
          error: true,
          message: "Error downloading file",
        });
      }
    });
  } catch (error) {
    console.error("Error downloading invoice:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id_student } = req.params;

    // Get invoice info from database
    const invoice = await Invoice.listByStudent(id_student);

    if (!invoice) {
      return res.status(404).send({
        error: true,
        message: "Invoice not found",
      });
    }

    return res.send({
      error: false,
      message: "Invoice fetched successfully",
      invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error.message);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};

const listInvoices = async (req, res) => {
  try {
    const { studentId } = req.query;

    let invoices;

    if (studentId) {
      invoices = await Invoice.listByStudent(studentId);
    } else {
      invoices = await Invoice.list();
    }

    return res.send({
      error: false,
      message: "Invoices fetched successfully",
      invoices,
    });
  } catch (error) {
    console.error("Error listing invoices:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updates = req.body;

    await Invoice.update(invoiceId, updates);
    return res.send({ error: false, message: "Invoice updated successfully" });
  } catch (error) {
    console.error("Error updating invoice:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Fetch the invoice details to get the file path
    const [invoiceResult] = await db.execute(
      `SELECT file FROM invoices WHERE id_invoice = ?`,
      [invoiceId]
    );

    if (invoiceResult.length === 0) {
      return res.status(404).send({
        error: true,
        message: "Invoice not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/invoices/",
      invoiceResult[0].file
    );

    // Delete the invoice file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the invoice record from the database
    await Invoice.delete(invoiceId);

    return res.send({
      error: false,
      message: "Invoice and associated file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  createInvoice,
  downloadInvoice,
  getInvoiceById,
  listInvoices,
  updateInvoice,
  deleteInvoice,
  upload,
};
