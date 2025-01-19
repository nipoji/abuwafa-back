// invoice-routes.js
const express = require("express");
const {
  createInvoice,
  listInvoices,
  updateInvoice,
  deleteInvoice,
  upload,
  downloadInvoice,
  getInvoiceById,
} = require("./invoiceControllers");
const { verifyToken } = require("./verifyToken");

const router = express.Router();

router.post("/invoice", verifyToken, upload.single("file"), createInvoice);
router.get("/invoices", verifyToken, listInvoices);
router.get("/invoice/download/:id_invoice", verifyToken, downloadInvoice);
router.get("/invoice/list/:id_student", verifyToken, getInvoiceById);
router.put("/invoice/:invoiceId", verifyToken, updateInvoice);
router.delete("/invoice/:invoiceId", verifyToken, deleteInvoice);

module.exports = {
  routes: router,
};
