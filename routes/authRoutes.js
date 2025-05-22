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
module.exports = router;
 