// activity-routes.js
const express = require('express');
const {
  createActivity,
  getActivity,
  listActivities,
  updateActivity,
  deleteActivity
} = require('./activityControllers');
const { verifyToken, verifyTokenAndAuth } = require('./verifyToken');

const router = express.Router();

router.post('/activity', verifyToken, createActivity);
router.get('/activity/:activityId', verifyToken, getActivity);
router.get('/activities', verifyToken, listActivities);  // No need to pass userId, it will be taken from the token
router.put('/activity/:activityId', verifyToken, updateActivity);
router.delete('/activity/:activityId', verifyToken, deleteActivity);

module.exports = {
  routes: router
};
