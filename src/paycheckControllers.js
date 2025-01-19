// paycheckControllers.js
const Paycheck = require('./paycheck');
const db = require('../database/db');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Create a Google Cloud Storage instance
const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME); // Replace with your Google Cloud Storage bucket name

// Configure multer to handle the file upload in memory
const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit the file size to 10MB
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

const createPaycheck = async (req, res) => {
  try {
    const { tutor_name, month, status } = req.body;

    if (!tutor_name || !month || !status || !req.file) {
      return res.status(400).send({
        error: true,
        message: 'Fields tutor_name, month, status, and file are required'
      });
    }

    // Find id_tutor based on tutor_name
    const [tutorResult] = await db.execute(`SELECT id_tutor FROM tutors WHERE tutor_name = ?`, [tutor_name]);
    if (tutorResult.length === 0) {
      return res.status(404).send({ error: true, message: `Tutor '${tutor_name}' not found` });
    }
    const id_tutor = tutorResult[0].id_tutor;

    // Construct the file name for the PDF (use a unique name or the original file name)
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = `paychecks/${fileName}`; // Store the file in a folder called 'paychecks'

    // Upload the file to Google Cloud Storage
    const file = bucket.file(filePath);
    const stream = file.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    stream.on('error', (err) => {
      console.error('Error uploading file to Google Cloud Storage:', err);
      return res.status(500).send({ error: true, message: 'Error uploading file to cloud storage' });
    });

    stream.on('finish', async () => {
      // Once the file upload is finished, save the file path to the database
      const paycheck = new Paycheck(null, id_tutor, tutor_name, month, status, filePath);
      await paycheck.save();

      return res.status(201).send({
        error: false,
        message: 'Paycheck created successfully',
        id: paycheck.id,
        fileUrl: `https://storage.googleapis.com/${bucket.name}/${filePath}` // Return the URL of the file
      });
    });

    // Pipe the file buffer to the cloud storage stream
    stream.end(req.file.buffer);

  } catch (error) {
    console.error("Error creating paycheck:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

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
      message: 'Paychecks fetched successfully',
      paychecks
    });
  } catch (error) {
    console.error("Error listing paychecks:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const updatePaycheck = async (req, res) => {
  try {
    const { paycheckId } = req.params;
    const updates = req.body;

    await Paycheck.update(paycheckId, updates);
    return res.send({ error: false, message: 'Paycheck updated successfully' });
  } catch (error) {
    console.error("Error updating paycheck:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

const deletePaycheck = async (req, res) => {
  try {
    const { paycheckId } = req.params;
    await Paycheck.delete(paycheckId);
    return res.send({ error: false, message: 'Paycheck deleted successfully' });
  } catch (error) {
    console.error("Error deleting paycheck:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

module.exports = {
  createPaycheck,
  listPaychecks,
  updatePaycheck,
  deletePaycheck,
  upload // Export the upload middleware for use in routes
};