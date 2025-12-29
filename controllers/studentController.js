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
    // Find student with direct username + password match
    const student = await User.findOne({
      where: {
        username,
        password,   // ⚠️ direct password check since no bcrypt
        role: 'student'
      }
    });

    if (!student) {
      return res.status(400).json({ message: 'Invalid username or password!' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: student.id, role: student.role, username: student.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: 'Login successful!',
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getTestsForStudent = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await User.findByPk(req.user.id, {
      include: {
        model: Batch,
        through: { attributes: [] }
      }
    });

    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!student.Batches || student.Batches.length === 0) {
      return res.status(404).json({ message: "Student not assigned to any batch" });
    }

    const batchIds = student.Batches.map(b => b.id);

    const tests = await Test.findAll({
      where: {
        batchId: batchIds
      },
      include: [
        {
          model: Question,
          as: "questions",
          include: [{ model: Option, as: "options" }]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({ tests });

  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const solveTest = async (req, res) => {
  const { testId, answers } = req.body;
  const studentId = req.user.id;

  if (!testId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    // Optional: check test existence
    const test = await Test.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Save / overwrite answers safely
    for (const ans of answers) {
      await TestAttempt.upsert({
        studentId,
        testId,
        questionId: ans.questionId,
        selectedOption: ans.selectedOption
      });
    }

    return res.status(200).json({
      message: "Test submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting test:", error);
    return res.status(500).json({ message: "Server error during test submission" });
  }
};

const getTestResult = async (req, res) => {
  const { testId, studentId } = req.params;

  try {
    // 1. Fetch the test questions with correct answers
    const test = await Test.findByPk(testId, {
      include: {
        model: Question,
        as: 'questions',
        attributes: ['id', 'questionText', 'correctOption'],
      },
    });
    if (!test) return res.status(404).json({ message: 'Test not found!' });

    // 2. Fetch the student's saved answers from the TestAttempt table
    const attempts = await TestAttempt.findAll({
      where: { testId, studentId },
    });
    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No attempt found for this student and test.' });
    }
    
    // 3. Fetch student details
    const student = await User.findByPk(studentId, { attributes: ['id', 'fullName'] });

    // 4. Calculate the score by comparing attempts to correct answers
    let score = 0;
    const detailedResults = test.questions.map(question => {
      const attempt = attempts.find(a => a.questionId === question.id);
      const isCorrect = attempt ? attempt.selectedOption === question.correctOption : false;

      if (isCorrect) {
        score++;
      }

      return {
        questionText: question.questionText,
        selectedOption: attempt ? attempt.selectedOption : null,
        correctOption: question.correctOption,
        isCorrect,
      };
    });
    
    const totalQuestions = test.questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // 5. Build and send the final result object
    return res.status(200).json({
      student,
      test: { id: test.id, testTitle: test.testTitle },
      score,
      totalQuestions,
      percentage: parseFloat(percentage.toFixed(2)),
      detailedResults,
    });

  } catch (error) {
    console.error('Error getting test result:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  studentLogin,
  getTestsForStudent,
   solveTest ,
   getTestResult
};
