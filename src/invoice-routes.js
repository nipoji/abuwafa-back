// invoice-routes.js
const express = require('express');
const {
  createInvoice,
  listInvoices,
  updateInvoice,
  deleteInvoice
} = require('./invoiceControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.post('/invoice', verifyToken, createInvoice);
router.get('/invoices', verifyToken, listInvoices);
router.put('/invoice/:invoiceId', verifyToken, updateInvoice);
router.delete('/invoice/:invoiceId', verifyToken, deleteInvoice);

module.exports = {
  routes: router
};