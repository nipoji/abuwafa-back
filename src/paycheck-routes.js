const express = require("express");
const {
  createPaycheck,
  listPaychecks,
  updatePaycheck,
  deletePaycheck,
  upload,
  downloadPaycheck,
} = require("./paycheckControllers");
const { verifyToken } = require("./verifyToken");

const router = express.Router();

// Update this route to use the upload middleware
router.post("/paycheck", verifyToken, upload.single("file"), createPaycheck);
router.get("/paychecks", verifyToken, listPaychecks);
router.get("/paycheck/download/:paycheckId", verifyToken, downloadPaycheck);
router.put("/paycheck/:paycheckId", verifyToken, updatePaycheck);
router.delete("/paycheck/:paycheckId", verifyToken, deletePaycheck);

module.exports = {
  routes: router,
};
