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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing from token.' });
    }

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
  const studentId = req.user.id; 

  const t = await sequelize.transaction();

  try {
    // Check if the student has already attempted this test
    const existingAttempt = await TestAttempt.findOne({ where: { studentId, testId } });
    if (existingAttempt) {
      return res.status(400).json({ message: 'You have already submitted this test.' });
    }

    // Prepare answers for bulk creation in the TestAttempt table
    const attemptData = answers.map(answer => ({
      studentId,
      testId,
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
    }));

    // Save all answers to the database
    await TestAttempt.bulkCreate(attemptData, { transaction: t });

    await t.commit();

    return res.status(201).json({ message: 'Test submitted successfully!' });

  } catch (error) {
    await t.rollback();
    console.error('Error submitting test:', error);
    return res.status(500).json({ message: 'Server error during test submission.' });
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
