// subject-routes.js
const express = require('express');
const {
  createSubject,
  listSubjects,
  updateSubject,
  deleteSubject
} = require('./subjectControllers'); // Ensure file and path are correct
const { verifyToken } = require('./verifyToken'); // Ensure file and path are correct

const router = express.Router();

router.post('/subject', verifyToken, createSubject);
router.get('/subjects', verifyToken, listSubjects);
router.put('/subject/:subjectId', verifyToken, updateSubject);
router.delete('/subject/:subjectId', verifyToken, deleteSubject);

module.exports = {
  routes: router
};