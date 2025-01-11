// profile-tutor-routes.js
const express = require('express');
const {
  getTutorProfile,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile
} = require('./profileTutorControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.get('/profile', verifyToken, getTutorProfile);
router.post('/profile', verifyToken, createTutorProfile);
router.patch('/profile/:id', verifyToken, updateTutorProfile);
router.delete('/profile/:id', verifyToken, deleteTutorProfile);

module.exports = {
  routes: router
};