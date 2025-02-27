const express = require("express");
const {
  createPaycheck,
  listPaychecks,
  downloadPaycheck,
  updatePaycheck,
  deletePaycheck,
} = require("./paycheckControllers");
const { verifyToken } = require("./verifyToken");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/paycheck", verifyToken, upload.single("file"), createPaycheck);
router.get("/paychecks", verifyToken, listPaychecks);
router.get("/paycheck/download/:paycheckId", verifyToken, downloadPaycheck);
router.put("/paycheck/:paycheckId", verifyToken, updatePaycheck);
router.delete("/paycheck/:paycheckId", verifyToken, deletePaycheck);

module.exports = {
  routes: router,
};
