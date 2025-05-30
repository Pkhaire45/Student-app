// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Admin login route
router.post('/login', authController.login); // Admin login
router.post('/register', authController.registerStudent); // Student registration
router.get('/students', authController.getStudents);
router.post('/add-teacher', authController.addTeacher);
router.get('/teachers', authController.getTeachers);
router.put('/teachers/:id', authController.editTeacher);
router.put('/students/:id', authController.editStudent);
router.post('/create-test', authController.createTest); // Create test with questions
router.get('/tests', authController.getAllTests); // Get test by ID with questions and options
router.delete('/students/:id', authController.deleteStudent); // Delete student by ID
router.delete('/teachers/:id', authController.deleteTeacher); // Delete teacher by ID
router.put('/tests/:id', authController.editTest); // Update test by ID
router.delete('/tests/:id', authController.deleteTest); // Delete test by ID
router.post('/attendance', authController.recordAttendance);// Mark attendance
router.get('/attendance', authController.getAttendance) 
module.exports = router;
 