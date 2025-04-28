// routes/studentRoutes.js

const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Student login route
router.post('/login', studentController.studentLogin);

module.exports = router;
