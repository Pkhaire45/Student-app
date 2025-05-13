// controllers/authController.js

require('dotenv').config(); // Load .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming User model is in models/

// Secret key for JWT (now from .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await User.findOne({ where: { username, role: 'admin' } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found!' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1h' } // expires in 1 hour
    );

    return res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Register Student
const registerStudent = async (req, res) => {
  const {
    fullName,
    username,
    email,
    password,
    role = 'student',
    standard,
    year,
    stream,
    contactNumber,
    dateOfBirth,
    guardianName,
    guardianContactNumber,
    guardianRelation
  } = req.body;

  try {
    // Check if the student already exists
    const existingStudent = await User.findOne({ where: { username } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the student
    const student = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      standard,
      year,
      stream,
      contactNumber,
      dateOfBirth,
      guardianName,
      guardianContactNumber,
      guardianRelation
    });

    return res.status(201).json({ message: 'Student created successfully!', student });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: { exclude: ['password'] } // Hides password from the response
    });

    return res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Server error while fetching students' });
  }
};

module.exports = {
  login,
  registerStudent,
  getStudents
};
