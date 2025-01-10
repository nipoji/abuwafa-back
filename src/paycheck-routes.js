// paycheck-routes.js
const express = require('express');
const {
  createPaycheck,
  listPaychecks,
  updatePaycheck,
  deletePaycheck
} = require('./paycheckControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.post('/paycheck', verifyToken, createPaycheck);
router.get('/paychecks', verifyToken, listPaychecks);
router.put('/paycheck/:paycheckId', verifyToken, updatePaycheck);
router.delete('/paycheck/:paycheckId', verifyToken, deletePaycheck);

module.exports = {
  routes: router
};