// controllers/authController.js

require('dotenv').config(); // Load .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User , Teacher} = require('../models'); // Assuming User model is in models/
const { Test, Question, Option, Attendance } = require('../models');
const { TestAttempt, Batch } = require('../models');
// Secret key for JWT (now from .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Try User model first (admin or student)
    let user = await User.findOne({ where: { username, password } }); 
    let userType = null;

    if (user) {
      userType = user.role; 
    } else {
      // Try teacher
      user = await Teacher.findOne({ where: { username, password } });
      if (user) userType = "teacher";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: userType, username: user.username },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      role: userType
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




const registerStudent = async (req, res) => {
  try {
    // 📩 Debug log (see exactly what frontend sends)
    console.log("📩 Raw Request Body:", req.body);

    let {
      fullName,
      username,
      email,
      password,
      role = "student",
      standard,
      year,
      stream,
      contactNumber,
      dateOfBirth,
      guardianName,
      guardianContactNumber,
      guardianRelation
    } = req.body;

    // 🔒 Ensure username exists
    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    // ✨ Normalize + trim (remove hidden chars, spaces)
    username = username.normalize("NFKC").trim();

    // ✅ Block auto-generated style usernames
    if (username.includes("_") && username.match(/\d{13}$/)) {
      return res.status(400).json({
        message: "Invalid auto-generated username detected. Please choose your own username."
      });
    }

    // 🔍 Username format check
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores."
      });
    }

    // 🔍 Uniqueness check
    const existingStudent = await User.findOne({ where: { username } });
    if (existingStudent) {
      return res.status(400).json({
        message: "Username already exists! Please try a different one."
      });
    }

    // ✅ Create student with EXACT username
    const student = await User.create({
      fullName: fullName?.trim(),
      username, // ✅ exact username from user
      email: email?.trim(),
      password, // ⚠️ plain text — not secure, but as requested
      role,
      standard,
      year,
      stream,
      contactNumber: contactNumber?.trim(),
      dateOfBirth,
      guardianName: guardianName?.trim(),
      guardianContactNumber: guardianContactNumber?.trim(),
      guardianRelation: guardianRelation?.trim()
    });

    return res.status(201).json({
      message: "Student created successfully!",
      student
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



const getStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' }// Hides password from the response
    });

    return res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Server error while fetching students' });
  }
};

const editStudent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body || {};

  try {
    const student = await User.findOne({ where: { id, role: 'student' } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    // Prevent password update here (optional)
    if (updateData.password) delete updateData.password;

    await student.update(updateData);

    return res.status(200).json({ message: 'Student updated successfully!', student });
  } catch (error) {
    console.error('Edit student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addTeacher = async (req, res) => {
  const {
    fullName,
    sex,
    dateOfBirth,
    contactNumber,
    address,
    teachingSubject,
    totalExperience,
    previousEmployer,
    username,
    email,
    password
  } = req.body;

  try {
    // Take the username exactly as provided, trimmed only
    const cleanUsername = username.trim();

    // Check if the teacher already exists with the exact username
    const existingTeacher = await Teacher.findOne({
      where: { username: cleanUsername }
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: 'Username already exists! Please try a different one.'
      });
    }

    // Create the teacher with the exact username entered
    const teacher = await Teacher.create({
      fullName,
      sex,
      dateOfBirth,
      contactNumber,
      address,
      teachingSubject,
      totalExperience,
      previousEmployer,
      username: cleanUsername, // Save only the trimmed username
      email,
      password
    });

    return res.status(201).json({
      message: 'Teacher created successfully!',
      teacher
    });

  } catch (error) {
    console.error('Register teacher error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    return res.status(200).json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ message: 'Server error while fetching teachers' });
  }
};

const editTeacher = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found!' });
    }

    // Prevent password update here (optional)
    if (updateData.password) delete updateData.password;

    await teacher.update(updateData);

    return res.status(200).json({ message: 'Teacher updated successfully!', teacher });
  } catch (error) {
    console.error('Edit teacher error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const createTest = async (req, res) => {
  const {
    testTitle,
    description,
    subject,
    class: className,
    duration,
    dueDate,
    dueTime,
    batchId,          // ✅ REQUIRED
    questions
  } = req.body;

  if (!batchId) {
    return res.status(400).json({ message: "batchId is required" });
  }

  try {
    const test = await Test.create({
      testTitle,
      description,
      subject,
      class: className,
      duration,
      dueDate,
      dueTime,
      batchId
    });

    for (const q of questions) {
      const { questionText, correctOption, options } = q;

      // Validate options array
      if (!Array.isArray(options) || options.length === 0) {
        // cleanup and return error so caller fixes payload
        await test.destroy();
        return res.status(400).json({ message: 'Each question must include a non-empty options array' });
      }

      // Validate correctOption if provided
      if (correctOption && (typeof correctOption !== 'number' || correctOption < 1 || correctOption > options.length)) {
        await test.destroy();
        return res.status(400).json({ message: 'correctOption must be a number between 1 and the number of provided options' });
      }

      const question = await Question.create({
        testId: test.id,
        questionText,
        correctOption
      });

      // Create options; accept either strings or objects { optionText } / { text }
      for (let i = 0; i < options.length; i++) {
        let optionVal = options[i];
        if (optionVal && typeof optionVal === 'object') {
          optionVal = optionVal.optionText || optionVal.text || optionVal.value || JSON.stringify(optionVal);
        } else if (optionVal === undefined || optionVal === null) {
          optionVal = '';
        } else {
          optionVal = String(optionVal);
        }

        await Option.create({
          questionId: question.id,
          optionText: optionVal,
          optionNumber: i + 1
        });
      }
    }

    return res.status(201).json({
      message: "Test created and assigned to batch",
      testId: test.id
    });

  } catch (error) {
    console.error("Create test error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getAllTests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const { role, id: userId } = req.user; // from JWT middleware

    let whereClause = {};

    // 👇 STUDENT: only tests of their batch
    if (role === "student") {
      const student = await User.findByPk(userId, {
        include: {
          model: Batch,
          through: { attributes: [] }
        }
      });

      if (!student || !student.Batches?.length) {
        return res.status(404).json({ message: "No batch assigned" });
      }

      const batchIds = student.Batches.map(b => b.id);
      whereClause.batchId = batchIds;
    }

    const tests = await Test.findAll({
      where: whereClause,
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
    console.error("Get tests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await User.findOne({ where: { id, role: 'student' } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    await student.destroy();

    return res.status(200).json({ message: 'Student deleted successfully!' });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found!' });
    }

    await teacher.destroy();

    return res.status(200).json({ message: 'Teacher deleted successfully!' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const editTest = async (req, res) => {
  const { id } = req.params;
  const { testTitle, description, subject, class: className, duration, dueDate, dueTime } = req.body;

  try {
    const test = await Test.findByPk(id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found!' });
    }

    await test.update({
      testTitle,
      description,
      subject,
      class: className,
      duration,
      dueDate,
      dueTime
    });

    return res.status(200).json({ message: 'Test updated successfully!', test });
  } catch (error) {
    console.error('Edit test error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findByPk(id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found!' });
    }

    await test.destroy();

    return res.status(200).json({ message: 'Test deleted successfully!' });
  } catch (error) {
    console.error('Delete test error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const recordAttendance = async (req, res) => {
  const { studentId, date, isPresent, remark } = req.body; // Added remark

  try {
    const student = await User.findOne({ where: { id: studentId, role: 'student' } });
    if (!student) {
      return res.status(404).json({ message: 'Student not found!' });
    }

    const attendance = await Attendance.create({
      studentId,
      date,
      isPresent,
      remark // Added remark
    });

    return res.status(201).json({ message: 'Attendance recorded successfully!', attendance });
  } catch (error) {
    console.error('Record attendance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getAttendance = async (req, res) => {
  const { studentId } = req.query;

  try {
    let whereClause = {};

    if (studentId) {
      whereClause.studentId = studentId;
    }

    const attendances = await Attendance.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'fullName', 'username']
      }]
    });

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'No attendance records found!' });
    }

    return res.status(200).json({ attendances });
  } catch (error) {
    console.error('Get attendance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const editQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { questionText, options, correctOption } = req.body;
  // options: [opt1, opt2, opt3, opt4], correctOption: 1-4

  try {
    const question = await Question.findByPk(questionId, {
      include: [{ model: Option, as: 'options' }]
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found!' });
    }

    // Update question text and correct option
    await question.update({
      questionText,
      correctOption
    });

    // Update options (assuming always 4 options)
    for (let i = 0; i < 4; i++) {
      const option = question.options.find(opt => opt.optionNumber === i + 1);
      if (option) {
        await option.update({ optionText: options[i] });
      }
    }

    return res.status(200).json({ message: 'Question updated successfully!', question });
  } catch (error) {
    console.error('Edit question error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findByPk(questionId, {
      include: [{ model: Option, as: 'options' }]
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found!' });
    }

    // Delete all options first
    for (const option of question.options) {
      await option.destroy();
    }

    // Delete the question
    await question.destroy();

    return res.status(200).json({ message: 'Question deleted successfully!' });
  } catch (error) {
    console.error('Delete question error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getAllTestSubmissions = async (req, res) => {
  const { testId } = req.params;

  try {
    // Fetch the test and its questions
    const test = await Test.findByPk(testId, {
      include: {
        model: Question,
        as: 'questions',
        attributes: ['id', 'questionText', 'correctOption'],
      },
    });
    if (!test) return res.status(404).json({ message: 'Test not found!' });

    // Get all attempts for this test
    const attempts = await TestAttempt.findAll({ where: { testId } });

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'No submissions found for this test.' });
    }

    // Group attempts by studentId
    const attemptsByStudent = {};
    attempts.forEach(attempt => {
      if (!attemptsByStudent[attempt.studentId]) {
        attemptsByStudent[attempt.studentId] = [];
      }
      attemptsByStudent[attempt.studentId].push(attempt);
    });

    // For each student, calculate their result
    const results = [];
    for (const studentId of Object.keys(attemptsByStudent)) {
      const studentAttempts = attemptsByStudent[studentId];
      const student = await User.findByPk(studentId, { attributes: ['id', 'fullName'] });

      let score = 0;
      const detailedResults = test.questions.map(question => {
        const attempt = studentAttempts.find(a => a.questionId === question.id);
        const isCorrect = attempt ? attempt.selectedOption === question.correctOption : false;
        if (isCorrect) score++;
        return {
          questionText: question.questionText,
          selectedOption: attempt ? attempt.selectedOption : null,
          correctOption: question.correctOption,
          isCorrect,
        };
      });

      const totalQuestions = test.questions.length;
      const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

      results.push({
        student,
        score,
        totalQuestions,
        percentage: parseFloat(percentage.toFixed(2)),
        detailedResults,
      });
    }

    return res.status(200).json({
      test: { id: test.id, testTitle: test.testTitle },
      results,
    });

  } catch (error) {
    console.error('Error getting all test submissions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  registerStudent,
  getStudents,
  editStudent,
  addTeacher,
  getTeachers,
  editTeacher,
  createTest,
  getAllTests,
  deleteStudent,
  deleteTeacher,
   editTest,
  deleteTest,
  recordAttendance,
  getAttendance,
   editQuestion,
   deleteQuestion,
   getAllTestSubmissions
};
