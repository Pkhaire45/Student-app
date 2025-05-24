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
module.exports = router;
 