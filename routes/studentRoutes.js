// routes/studentRoutes.js

const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

// Student login route
router.post('/login', studentController.studentLogin);
router.get('/tests', authMiddleware,studentController.getTestsForStudent); // Get tests for student
router.post('/solve-test',authMiddleware, studentController.solveTest);
router.get('/test-result/:testId', authMiddleware, studentController.getTestResult); // Get test result for student
module.exports = router;
