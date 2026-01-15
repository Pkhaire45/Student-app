const Test = require("../models/Test");
const Question = require("../models/Question");
const TestAttempt = require("../models/TestAttempt");
const Student = require("../models/Student");

/**
 * CREATE TEST (ADMIN / TEACHER)
 */
exports.createTest = async (req, res) => {
  try {
    const { questions, ...testData } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required" });
    }

    const test = await Test.create({
      ...testData,
      instituteId: req.instituteId
    });

    for (const q of questions) {
      await Question.create({
        instituteId: req.instituteId,
        testId: test._id,
        questionText: q.questionText,
        correctOption: q.correctOption,
        options: q.options
      });
    }

    return res.status(201).json({
      message: "Test created successfully",
      testId: test._id
    });
  } catch (error) {
    console.error("Create test error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET TESTS (ROLE AWARE)
 */
exports.getTests = async (req, res) => {
  try {
    let filter = { instituteId: req.instituteId };

    // If student → only their batch tests
    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({
        _id: req.user.userId,
        instituteId: req.instituteId
      });

      if (!student || !student.batchIds?.length) {
        return res.status(404).json({ message: "No batch assigned" });
      }

      filter.batchId = { $in: student.batchIds };
    }

    const tests = await Test.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ tests });
  } catch (error) {
    console.error("Get tests error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL TEST SUBMISSIONS (ADMIN / TEACHER)
 * 🔥 THIS WAS MISSING – CAUSED YOUR CRASH
 */
exports.getAllTestSubmissions = async (req, res) => {
  const { testId } = req.params;

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
      instituteId: req.instituteId
    });

    if (!attempts.length) {
      return res.status(404).json({ message: "No submissions found" });
    }

    // Group attempts by student
    const attemptsByStudent = {};
    for (const a of attempts) {
      const sid = a.studentId.toString();
      if (!attemptsByStudent[sid]) {
        attemptsByStudent[sid] = [];
      }
      attemptsByStudent[sid].push(a);
    }

    const results = [];

    for (const studentId of Object.keys(attemptsByStudent)) {
      const student = await Student.findById(studentId).select(
        "fullName username"
      );

      let score = 0;

      const detailedResults = questions.map((q) => {
        const attempt = attemptsByStudent[studentId].find(
          (a) => a.questionId.toString() === q._id.toString()
        );

        const isCorrect =
          attempt && attempt.selectedOption === q.correctOption;

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

      results.push({
        student,
        score,
        totalQuestions,
        percentage: Number(percentage.toFixed(2)),
        detailedResults
      });
    }

    return res.status(200).json({
      test: {
        id: test._id,
        testTitle: test.testTitle
      },
      results
    });
  } catch (error) {
    console.error("Get test submissions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
