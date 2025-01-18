// profile-student-routes.js
const express = require("express");
const {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  getStudentProfileById,
} = require("./profileStudentControllers");
const { verifyToken } = require("./verifyToken");

const router = express.Router();

router.get("/profiles", verifyToken, getStudentProfile);
router.get("/profile", verifyToken, getStudentProfileById);
// router.post('/profile', verifyToken, getStudentProfile);
router.post("/profile", verifyToken, createStudentProfile);
router.patch("/profile/:id", verifyToken, updateStudentProfile);
router.delete("/profile/:id", verifyToken, deleteStudentProfile);

module.exports = {
  routes: router,
};
