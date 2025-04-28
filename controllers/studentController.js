// controllers/studentController.js

require('dotenv').config(); // Load .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming User model is in models/

// Secret key for JWT (from .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Student Login
const studentLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the student by username
    const student = await User.findOne({ where: { username, role: 'student' } });

    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT for the student
    const token = jwt.sign(
      { id: student.id, role: student.role, username: student.username },
      JWT_SECRET,
      { expiresIn: '1h' } // expires in 1 hour
    );

    return res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  studentLogin
};
