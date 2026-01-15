const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Batch = require("../models/Batch");
const Test = require("../models/Test");
const Question = require("../models/Question");
const TestAttempt = require("../models/testAttempt");
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

exports.registerStudent = async (req, res) => {
  const {
    fullName,
    username,
    email,
    password,
    standard,
    year,
    stream,
    contactNumber,
    dateOfBirth,
    guardianName,
    guardianContactNumber,
    guardianRelation,
    batchIds = []
  } = req.body;

  try {
    // 1️⃣ Basic validation
    if (!fullName || !username || !password) {
      return res.status(400).json({
        message: "fullName, username and password are required"
      });
    }

    // 2️⃣ Normalize username
    const cleanUsername = username.trim();

    // 3️⃣ Check uniqueness (INSTITUTE-WISE)
    const existingStudent = await Student.findOne({
      username: cleanUsername,
      instituteId: req.instituteId
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Username already exists in this institute"
      });
    }

    // 4️⃣ Create student (PLAIN PASSWORD)
    const student = await Student.create({
      instituteId: req.instituteId,
      fullName: fullName.trim(),
      username: cleanUsername,
      email: email?.trim(),
      password, // ❗ plain text as requested
      standard,
      year,
      stream,
      contactNumber,
      dateOfBirth,
      guardianName,
      guardianContactNumber,
      guardianRelation,
      batchIds
    });

    return res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        fullName: student.fullName,
        username: student.username,
        email: student.email
      }
    });
  } catch (error) {
    console.error("Register student error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.studentLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const student = await Student.findOne({
      username,
      instituteId: req.instituteId
    }).select("+password");

    if (!student) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ❗ Plain password comparison (as requested)
    if (student.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateToken({
      userId: student._id,
      role: "STUDENT",
      instituteId: student.instituteId
    });

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getTestsForStudent = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const student = await Student.findOne({
      _id: studentId,
      instituteId: req.instituteId
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.batchIds || student.batchIds.length === 0) {
      return res.status(404).json({ message: "Student not assigned to any batch" });
    }

    const tests = await Test.find({
      instituteId: req.instituteId,
      batchId: { $in: student.batchIds }
    }).sort({ createdAt: -1 });

    return res.status(200).json({ tests });
  } catch (error) {
    console.error("Get tests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.solveTest = async (req, res) => {
  const { testId, answers } = req.body;
  const studentId = req.user.userId;

  if (!testId || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    const test = await Test.findOne({
      _id: testId,
      instituteId: req.instituteId
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    for (const ans of answers) {
      await TestAttempt.updateOne(
        {
          instituteId: req.instituteId,
          studentId,
          testId,
          questionId: ans.questionId
        },
        {
          $set: {
            selectedOption: ans.selectedOption,
            answeredAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    return res.status(200).json({
      message: "Test submitted successfully"
    });
  } catch (error) {
    console.error("Solve test error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getTestResult = async (req, res) => {
  const { testId } = req.params;
  const studentId = req.user.userId;

  try {
    const test = await Test.findOne({
      _id: testId,
      instituteId: req.instituteId
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = await Question.find({
      testId,
      instituteId: req.instituteId
    });

    const attempts = await TestAttempt.find({
      testId,
      studentId,
      instituteId: req.instituteId
    });

    if (!attempts.length) {
      return res.status(404).json({ message: "No attempt found for this test" });
    }

    let score = 0;

    const detailedResults = questions.map((q) => {
      const attempt = attempts.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      const isCorrect = attempt
        ? attempt.selectedOption === q.correctOption
        : false;

      if (isCorrect) score++;

      return {
        questionText: q.questionText,
        selectedOption: attempt?.selectedOption ?? null,
        correctOption: q.correctOption,
        isCorrect
      };
    });

    const totalQuestions = questions.length;
    const percentage =
      totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    return res.status(200).json({
      test: {
        id: test._id,
        testTitle: test.testTitle
      },
      score,
      totalQuestions,
      percentage: Number(percentage.toFixed(2)),
      detailedResults
    });
  } catch (error) {
    console.error("Get test result error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
