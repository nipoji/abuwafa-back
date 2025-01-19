// invoiceControllers.js
const Invoice = require('./invoice');
const db = require('../database/db');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Create a Google Cloud Storage instance
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME); // Replace with your Google Cloud Storage bucket name

// Configure multer to handle file upload in memory
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// Create invoice with PDF upload
const createInvoice = async (req, res) => {
  try {
    const { student_name, month, status } = req.body;
    const file = req.file; // The uploaded file

    if (!student_name || !month || !status || !file) {
      return res.status(400).send({
        error: true,
        message: 'Fields student_name, month, status, and file are required'
      });
    }

    // Find id_student based on student_name
    const [studentResult] = await db.execute(`SELECT id_student FROM students WHERE student_name = ?`, [student_name]);
    if (studentResult.length === 0) {
      return res.status(404).send({ error: true, message: `Student '${student_name}' not found` });
    }
    const id_student = studentResult[0].id_student;

    // Construct the file name for the PDF (use a unique name or the original file name)
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = `invoices/${fileName}`; // Store the file in a folder called 'invoices'

    // Upload the file to Google Cloud Storage
    const gcsFile = bucket.file(filePath);
    const stream = gcsFile.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    stream.on('error', (err) => {
      console.error('Error uploading file to Google Cloud Storage:', err);
      return res.status(500).send({ error: true, message: 'Error uploading file to cloud storage' });
    });

    stream.on('finish', async () => {
      // Once the file upload is finished, save the file path (URL) to the database
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

      const invoice = new Invoice(null, id_student, student_name, month, fileUrl, status);
      await invoice.save();

      return res.status(201).send({
        error: false,
        message: 'Invoice created successfully',
        id: invoice.id,
        fileUrl // Return the URL of the uploaded file
      });
    });

    // Pipe the file buffer to the cloud storage stream
    stream.end(file.buffer);

  } catch (error) {
    console.error("Error creating invoice:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

// List invoices
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
      message: 'Invoices fetched successfully',
      invoices
    });
  } catch (error) {
    console.error("Error listing invoices:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updates = req.body;

    await Invoice.update(invoiceId, updates);
    return res.send({ error: false, message: 'Invoice updated successfully' });
  } catch (error) {
    console.error("Error updating invoice:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    await Invoice.delete(invoiceId);
    return res.send({ error: false, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error("Error deleting invoice:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  createInvoice,
  listInvoices,
  updateInvoice,
  deleteInvoice,
  upload // Export the upload middleware to be used in routes
};