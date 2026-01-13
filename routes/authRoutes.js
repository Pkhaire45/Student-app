// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Admin login route
router.post('/login', authController.login); // Admin login
router.post('/register', authController.registerStudent); // Student registration
router.post('/register-admin', authController.registerAdmin); // Admin registration
router.get('/students', authController.getStudents);
router.post('/add-teacher', authController.addTeacher);
router.get('/teachers', authController.getTeachers);
router.put('/teachers/:id', authController.editTeacher);
router.put('/students/:id', authController.editStudent);
// Protected test routes
router.post('/create-test', auth, authController.createTest); // Create test with questions
router.get('/tests', auth, authController.getAllTests); // Get test by ID with questions and options
router.get('/tests/batch/:batchId', auth, authController.getTestsByBatch); // Get tests for a specific batch
router.delete('/students/:id', authController.deleteStudent); // Delete student by ID
router.delete('/teachers/:id', authController.deleteTeacher); // Delete teacher by ID
router.put('/tests/:id', auth, authController.editTest);
// In your routes file
router.get('/test/:testId/submissions', auth, authController.getAllTestSubmissions); // Update test by ID
router.delete('/tests/:id', auth, authController.deleteTest); // Delete test by ID
router.post('/attendance', auth, authController.recordAttendance);// Mark attendance
router.get('/attendance', auth, authController.getAttendance) 
router.put('/questions/:questionId', auth, authController.editQuestion);
router.delete('/question/:questionId', auth, authController.deleteQuestion);

module.exports = router;
 