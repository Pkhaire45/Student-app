// routes/studentRoutes.js

const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Student login route
router.post('/login', studentController.studentLogin);
router.get('/tests', studentController.getTestsForStudent); // Get tests for student
router.post('/solve-test', studentController.solveTest);
module.exports = router;
