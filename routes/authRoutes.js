// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Admin login route
router.post('/login', authController.login); // Admin login
router.post('/register', authController.registerStudent); // Student registration
// Student login route

module.exports = router;
 