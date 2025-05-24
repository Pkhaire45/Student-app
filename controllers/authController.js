// controllers/authController.js

require('dotenv').config(); // Load .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User , Teacher} = require('../models'); // Assuming User model is in models/
const { Test, Question, Option } = require('../models');
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

const editStudent = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

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
    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ where: { username } });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the teacher
    const teacher = await Teacher.create({
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
      password: hashedPassword
    });

    return res.status(201).json({ message: 'Teacher created successfully!', teacher });

  } catch (error) {
    console.error('Register teacher error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: { exclude: ['password'] } // Exclude password from response
    });
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
  const { testTitle, description, subject, class: className, questions } = req.body;
  // questions: [{ questionText, options: [opt1, opt2, opt3, opt4], correctOption }]
  try {
    const test = await Test.create({
      testTitle,
      description,
      subject,
      class: className
    });

    for (const q of questions) {
      const question = await Question.create({
        testId: test.id,
        questionText: q.questionText,
        correctOption: q.correctOption // 1,2,3,4
      });

      for (let i = 0; i < 4; i++) {
        await Option.create({
          questionId: question.id,
          optionText: q.options[i],
          optionNumber: i + 1
        });
      }
    }

    return res.status(201).json({ message: 'Test created with questions!', testId: test.id });
  } catch (error) {
    console.error('Create test error:', error);
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
  createTest
};
