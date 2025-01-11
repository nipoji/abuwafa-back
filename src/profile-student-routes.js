// profile-student-routes.js
const express = require('express');
const {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
} = require('./profileStudentControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.get('/profile', verifyToken, getStudentProfile);
router.post('/profile', verifyToken, getStudentProfile);
router.post('/profile', verifyToken, createStudentProfile);
router.patch('/profile/:id', verifyToken, updateStudentProfile);
router.delete('/profile/:id', verifyToken, deleteStudentProfile);

module.exports = {
  routes: router
};