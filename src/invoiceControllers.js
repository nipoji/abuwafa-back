// invoiceControllers.js
const Invoice = require('./invoice');
const db = require('../database/db');

const createInvoice = async (req, res) => {
  try {
    const { id_invoice, student_name, month, file, status } = req.body;

    if (!student_name || !month || !status) {
      return res.status(400).send({
        error: true,
        message: 'Fields student_name, month, and status are required'
      });
    }

    // Find id_student based on student_name
    const [studentResult] = await db.execute(`SELECT id_student FROM students WHERE student_name = ?`, [student_name]);
    if (studentResult.length === 0) {
      return res.status(404).send({ error: true, message: `Student '${student_name}' not found` });
    }
    const id_student = studentResult[0].id_student;

    // Create a new invoice
    const invoice = new Invoice(id_invoice, id_student, student_name, month, file, status);
    await invoice.save();

    return res.status(201).send({
      error: false,
      message: 'Invoice created successfully',
      id: invoice.id
    });
  } catch (error) {
    console.error("Error creating invoice:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
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
      message: 'Invoices fetched successfully',
      invoices
    });
  } catch (error) {
    console.error("Error listing invoices:", error.message);
    return res.status(500).send({ error: true, message: 'Internal server error' });
  }
};

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
  deleteInvoice
};