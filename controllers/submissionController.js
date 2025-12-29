const db = require("../models");
const { Submission, Assignment, User, Batch } = db;

/* ======================================================
   SUBMIT ASSIGNMENT (Student)
====================================================== */
const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { assignment_id } = req.body;

    if (!assignment_id) {
      return res.status(400).json({ message: "assignment_id is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Fetch assignment
    const assignment = await Assignment.findByPk(assignment_id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Verify student belongs to assignment batch
    const student = await User.findByPk(studentId, {
      include: {
        model: Batch,
        through: { attributes: [] }
      }
    });

    const batchIds = student.Batches.map(b => b.id);
    if (!batchIds.includes(assignment.batchId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Prepare files
    const submitted_files = req.files.map(file => ({
      file_name: file.originalname,
      file_url: `/uploads/submissions/${file.filename}`,
      file_type: file.mimetype,
      file_size: file.size
    }));

    // Detect late submission
    const isLate = new Date() > new Date(assignment.due_date);

    // Create or update submission (safe because of UNIQUE constraint)
    const [submission] = await Submission.upsert({
      assignment_id,
      student_id: studentId,
      submitted_files,
      submission_time: new Date(),
      status: isLate ? "late" : "submitted"
    });

    return res.status(201).json({
      message: isLate
        ? "Assignment submitted (late)"
        : "Assignment submitted successfully",
      submission
    });

  } catch (error) {
    console.error("Submit assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ALL SUBMISSIONS FOR AN ASSIGNMENT (Teacher / Admin)
====================================================== */
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const submissions = await Submission.findAll({
      where: { assignment_id },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "fullName", "username", "email"]
        }
      ],
      order: [["submission_time", "DESC"]]
    });

    return res.status(200).json({ submissions });

  } catch (error) {
    console.error("Get submissions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET STUDENT'S SUBMISSION (Student)
====================================================== */
const getSubmissionByStudent = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const studentId = req.user.id;

    const submission = await Submission.findOne({
      where: { assignment_id, student_id: studentId }
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({ submission });

  } catch (error) {
    console.error("Get submission by student error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GRADE SUBMISSION (Teacher / Admin)
====================================================== */
const updateSubmissionEvaluation = async (req, res) => {
  try {
    const { marks_obtained, feedback } = req.body;

    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    await submission.update({
      marks_obtained,
      feedback,
      status: "graded"
    });

    return res.status(200).json({
      message: "Submission evaluated successfully",
      submission
    });

  } catch (error) {
    console.error("Evaluate submission error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionByStudent,
  updateSubmissionEvaluation
};
