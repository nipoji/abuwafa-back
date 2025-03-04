// invoiceControllers.js
const Invoice = require("./invoice");
const db = require("../database/db");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Create a Google Cloud Storage instance
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME); // Replace with your Google Cloud Storage bucket name

// Configure multer to handle file upload in memory
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// Create invoice with PDF upload
const createInvoice = async (req, res) => {
  try {
    const { id_student, month, status } = req.body;
    const file = req.file; // The uploaded file

    if (!id_student || !month || !status || !file) {
      return res.status(400).send({
        error: true,
        message: "Fields id_student, month, status, and file are required",
      });
    }

    // Find student_name based on id_student
    const [studentResult] = await db.execute(
      `SELECT student_name FROM students WHERE id_student = ?`,
      [id_student]
    );
    if (studentResult.length === 0) {
      return res
        .status(404)
        .send({ error: true, message: `Student '${id_student}' not found` });
    }
    const student_name = studentResult[0].student_name;

    // Buat nama file unik
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = `invoices/${fileName}`;

    // Upload ke Google Cloud Storage
    const gcsFile = bucket.file(filePath);
    const stream = gcsFile.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    stream.on("error", (err) => {
      console.error("Error uploading file to Google Cloud Storage:", err);
      return res.status(500).send({
        error: true,
        message: "Error uploading file to cloud storage",
      });
    });

    stream.on("finish", async () => {
      // Simpan hanya fileName ke database, bukan URL lengkapnya
      const invoice = new Invoice(
        null,
        id_student,
        student_name,
        month,
        fileName,
        status
      );
      await invoice.save();

      return res.status(201).send({
        error: false,
        message: "Invoice created successfully",
        id: invoice.id,
        fileName, // Kembalikan nama file, bukan URL
      });
    });

    stream.end(file.buffer);
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

    // Ambil invoice dari database
    const invoice = await Invoice.get(id_invoice);
    if (!invoice) {
      return res.status(404).send({
        error: true,
        message: "Invoice not found",
      });
    }

    // Bangun kembali URL berdasarkan nama file yang disimpan di database
    const fileName = invoice.file; // Sekarang hanya menyimpan nama file
    const filePath = `invoices/${fileName}`;
    const file = bucket.file(filePath);

    // Periksa apakah file ada di Cloud Storage
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).send({
        error: true,
        message: "File not found in cloud storage",
      });
    }

    // Download file ke buffer
    const [fileBuffer] = await file.download();

    // Set headers untuk download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", fileBuffer.length);

    return res.send(fileBuffer);
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

const getInvoiceByIdInvoice = async (req, res) => {
  try {
    const { id_invoice } = req.params;
    // Get invoice info from database
    const invoice = await Invoice.get(id_invoice);
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

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updates = req.body;
    const file = req.file; // Optional file upload

    // Fetch the existing invoice to get current file URL
    const existingInvoice = await Invoice.get(invoiceId);
    if (!existingInvoice) {
      return res
        .status(404)
        .send({ error: true, message: "Invoice not found" });
    }

    let fileUrl = existingInvoice.file;

    if (file) {
      // Delete the existing file from Google Cloud Storage
      const oldFilePath = fileUrl.replace(
        `https://storage.googleapis.com/${bucket.name}/`,
        ""
      );
      const oldFile = bucket.file(oldFilePath);
      try {
        await oldFile.delete();
        console.log("Old file deleted successfully from cloud storage");
      } catch (err) {
        console.error("Error deleting old file from cloud storage:", err);
      }

      // Upload the new file to Google Cloud Storage
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = `invoices/${fileName}`;
      const gcsFile = bucket.file(filePath);
      const stream = gcsFile.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      stream.on("error", (err) => {
        console.error("Error uploading file to Google Cloud Storage:", err);
        return res.status(500).send({
          error: true,
          message: "Error uploading file to cloud storage",
        });
      });

      stream.on("finish", async () => {
        fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        // Update the invoice in the database
        updates.file = fileUrl;
        await Invoice.update(invoiceId, updates);

        return res.send({
          error: false,
          message: "Invoice updated successfully",
          fileUrl,
        });
      });

      // Pipe the file buffer to the cloud storage stream
      stream.end(file.buffer);
      return;
    }

    // If no file is uploaded, just update other fields
    await Invoice.update(invoiceId, updates);
    return res.send({ error: false, message: "Invoice updated successfully" });
  } catch (error) {
    console.error("Error updating invoice:", error.message);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    // Fetch the invoice details to get the file URL
    const invoice = await Invoice.get(invoiceId);
    if (!invoice) {
      return res
        .status(404)
        .send({ error: true, message: "Invoice not found" });
    }

    // Extract the file path from the invoice's file URL
    const filePath = invoice.file.replace(
      `https://storage.googleapis.com/${bucket.name}/`,
      ""
    );
    const file = bucket.file(filePath);

    // Attempt to delete the file from Google Cloud Storage
    try {
      await file.delete();
      console.log("File deleted successfully from cloud storage");
    } catch (err) {
      console.error("Error deleting file from cloud storage:", err);
    }

    // Delete the invoice record from the database
    await Invoice.delete(invoiceId);
    return res.send({ error: false, message: "Invoice deleted successfully" });
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
  getInvoiceByIdInvoice,
  listInvoices,
  updateInvoice,
  deleteInvoice,
  upload,
};
