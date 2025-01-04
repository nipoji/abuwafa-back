// user-routes.js
const express = require('express');
const { userLogin } = require('./userControllers');  // Ensure the correct path to userController
const { createAccount } = require('./userControllers');

const router = express.Router();

router.post('/login', userLogin);
router.post('/register', createAccount);

module.exports = {
  routes: router
};