// profile-admin-routes.js
const express = require('express');
const {
  updateAdminProfile
} = require('./profileAdminControllers');
const { verifyToken } = require('./verifyToken');

const router = express.Router();

router.patch('/profile', verifyToken, updateAdminProfile);

module.exports = {
  routes: router
};