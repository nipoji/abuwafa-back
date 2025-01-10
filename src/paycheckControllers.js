// paycheckControllers.js
const Paycheck = require('./paycheck');
const db = require('../database/db');

const createPaycheck = async (req, res) => {
  try {
    const { id_paycheck, tutor_name, month, status, file } = req.body;

    if (!tutor_name || !month || !status) {
      return res.status(400).send({
        error: true,
        message: 'Fields tutor_name, month, and status are required'
      });
    }

    // Find id_tutor based on tutor_name
    const [tutorResult] = await db.execute(`SELECT id_tutor FROM tutors WHERE tutor_name = ?`, [tutor_name]);
    if (tutorResult.length === 0) {
      return res.status(404).send({ error: true, message: `Tutor '${tutor_name}' not found` });
    }
    const id_tutor = tutorResult[0].id_tutor;

    // Create a new paycheck
    const paycheck = new Paycheck(id_paycheck, id_tutor, tutor_name, month, status, file);
    await paycheck.save();

    return res.status(201).send({
      error: false,
      message: 'Paycheck created successfully',
      id: paycheck.id
    });
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
  deletePaycheck
};