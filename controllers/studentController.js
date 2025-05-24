// controllers/studentController.js

require('dotenv').config(); // Load .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Test, User, Question, Option } = require('../models'); // Assuming User model is in models/

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
const getTestsForStudent = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware adds user info to req
    const user = await User.findByPk(userId);

    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const matchingTests = await Test.findAll({
      where: {
        class: user.standard
      },
      include: [
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: Option,
              as: 'options'
            }
          ]
        }
      ]
    });

    return res.json(matchingTests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const solveTest = async (req, res) => {
  const { testId, answers } = req.body;
  // answers: [{ questionId: 1, selectedOption: 2 }, ...]

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if the test exists and is assigned to the student's class
    const test = await Test.findOne({
      where: { id: testId, class: user.standard }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found or not assigned to your class.' });
    }

    let correct = 0;
    let total = answers.length;

    for (const ans of answers) {
      // Ensure the question belongs to this test
      const question = await Question.findOne({
        where: { id: ans.questionId, testId: test.id }
      });
      if (question && question.correctOption === ans.selectedOption) {
        correct++;
      }
    }

    return res.status(200).json({
      total,
      correct,
      message: `You answered ${correct} out of ${total} questions correctly.`
    });
  } catch (error) {
    console.error('Error solving test:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  studentLogin,
  getTestsForStudent,
   solveTest 
};
