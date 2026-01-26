const Test = require("../models/Test");
const Question = require("../models/Question");
const TestAttempt = require("../models/testAttempt");
const Student = require("../models/Student");

/**
 * CREATE TEST (ADMIN / TEACHER)
 */
exports.createTest = async (req, res) => {
  try {
    const {
      questions,
      testTitle,
      description,
      subject,
      standard,
      duration,
      testType,
      batchId,
      dueDate
    } = req.body;

    // 1️⃣ Validate required fields
    if (!testTitle || !subject || !duration || !testType || !batchId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required" });
    }

    // 2️⃣ Create Test
    const test = await Test.create({
      instituteId: req.instituteId,
      batchId,
      testTitle,
      description,
      subject,
      standard,
      duration,
      testType,
      dueDate
    });

    // 3️⃣ Process Questions
    for (const q of questions) {
      let formattedOptions = [];

      // Smart handling: if options is array of strings, map to objects
      if (Array.isArray(q.options) && typeof q.options[0] === "string") {
        formattedOptions = q.options.map((opt, index) => ({
          optionText: opt,
          optionNumber: index + 1
        }));
      } else {
        // Assume already in correct format
        formattedOptions = q.options;
      }

      await Question.create({
        instituteId: req.instituteId,
        testId: test._id,
        questionText: q.questionText,
        correctOption: Number(q.correctOption),
        options: formattedOptions
      });
    }

    return res.status(201).json({
      message: "Test created successfully",
      testId: test._id,
      testType: test.testType
    });
  } catch (error) {
    console.error("Create test error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
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

/**
 * GET TEST BY ID
 */
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findOne({ _id: testId, instituteId: req.instituteId });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const questions = await Question.find({ testId: test._id, instituteId: req.instituteId });

    return res.status(200).json({ test, questions });
  } catch (error) {
    console.error("Get test by ID error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... existing code ...
/**
 * GET TESTS BY BATCH ID
 */
exports.getTestsByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;

    // Validate that batchId is provided
    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required" });
    }

    const tests = await Test.find({ batchId, instituteId: req.instituteId }).sort({ createdAt: -1 });

    return res.status(200).json({ tests });
  } catch (error) {
    console.error("Get tests by batch ID error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * UPDATE TEST (ADMIN / TEACHER)
 */
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const {
      questions,
      testTitle,
      description,
      subject,
      standard,
      duration,
      testType,
      batchId,
      dueDate,
      dueTime
    } = req.body;

    // 1️⃣ Find the test
    const test = await Test.findOne({ _id: testId, instituteId: req.instituteId });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // 2️⃣ Update Test Fields
    if (testTitle) test.testTitle = testTitle;
    if (description) test.description = description;
    if (subject) test.subject = subject;
    if (standard) test.standard = standard;
    if (duration) test.duration = duration;
    if (testType) test.testType = testType;
    if (batchId) test.batchId = batchId;
    if (dueDate) test.dueDate = dueDate;
    if (dueTime) test.dueTime = dueTime;

    await test.save();

    // 3️⃣ Update Questions if provided
    // If questions array is strictly provided (even empty), we replace them.
    // If it's undefined, we leave existing questions alone.
    if (questions && Array.isArray(questions)) {
      // Remove old questions
      await Question.deleteMany({ testId: test._id });

      // Create new questions
      if (questions.length > 0) {
        for (const q of questions) {
          let formattedOptions = [];

          if (Array.isArray(q.options) && typeof q.options[0] === "string") {
            formattedOptions = q.options.map((opt, index) => ({
              optionText: opt,
              optionNumber: index + 1
            }));
          } else {
            formattedOptions = q.options;
          }

          await Question.create({
            instituteId: req.instituteId,
            testId: test._id,
            questionText: q.questionText,
            correctOption: Number(q.correctOption),
            options: formattedOptions
          });
        }
      }
    }

    return res.status(200).json({
      message: "Test updated successfully",
      testId: test._id
    });
  } catch (error) {
    console.error("Update test error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE TEST (ADMIN / TEACHER)
 */
exports.deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    // 1️⃣ Find and delete the test
    const test = await Test.findOneAndDelete({
      _id: testId,
      instituteId: req.instituteId
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // 2️⃣ Delete associated questions
    await Question.deleteMany({ testId: testId });

    // 3️⃣ Delete associated attempts (Optional but recommended to keep DB clean)
    await TestAttempt.deleteMany({ testId: testId });

    return res.status(200).json({ message: "Test and related data deleted successfully" });
  } catch (error) {
    console.error("Delete test error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

