const Submission = require("../models/Submission");
const Assignment = require("../models/assignment");
const Student = require("../models/Student");

/* ======================================================
   SUBMIT ASSIGNMENT (STUDENT)
====================================================== */
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Check if assignment exists
        const assignment = await Assignment.findOne({
            _id: assignmentId,
            instituteId: req.instituteId
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if student belongs to the batch of the assignment
        const student = await Student.findOne({
            _id: req.user.userId,
            instituteId: req.instituteId
        });

        if (!student || !student.batchIds.includes(assignment.batchId.toString())) {
            return res.status(403).json({ message: "You are not authorized to submit this assignment" });
        }

        // Handle attachments
        let submittedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            submittedFiles = req.files.map(file => ({
                fileUrl: `/uploads/submissions/${file.filename}`
            }));
        }

        // Check if submission already exists (resubmission logic can be added here)
        let submission = await Submission.findOne({
            assignmentId,
            studentId: req.user.userId
        });

        if (submission) {
            // Update existing submission (resubmit)
            if (req.files && req.files.length > 0) {
                submission.submittedFiles.push(...submittedFiles);
            }
            submission.status = "resubmitted";
            submission.submissionTime = Date.now();
            await submission.save();
        } else {
            // Create new submission
            submission = await Submission.create({
                instituteId: req.instituteId,
                assignmentId,
                studentId: req.user.userId,
                submittedFiles,
                status: "submitted"
            });
        }

        // Check for late submission
        if (new Date() > new Date(assignment.dueDate)) {
            submission.status = "late";
            await submission.save();
        }

        return res.status(200).json({
            message: "Assignment submitted successfully",
            submission
        });

    } catch (error) {
        console.error("Submit assignment error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET SUBMISSIONS BY ASSIGNMENT (ADMIN / TEACHER)
====================================================== */
exports.getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findOne({
            _id: assignmentId,
            instituteId: req.instituteId
        });
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const submissions = await Submission.find({
            assignmentId,
            instituteId: req.instituteId
        })
            .populate("studentId", "name email rollNumber")
            .sort({ submissionTime: -1 });

        return res.status(200).json({ submissions });

    } catch (error) {
        console.error("Get submissions error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   GET MY SUBMISSION (STUDENT)
====================================================== */
exports.getMySubmission = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submission = await Submission.findOne({
            assignmentId,
            studentId: req.user.userId,
            instituteId: req.instituteId
        });

        if (!submission) {
            return res.status(404).json({ message: "No submission found" });
        }

        return res.status(200).json({ submission });

    } catch (error) {
        console.error("Get my submission error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   EVALUATE SUBMISSION (ADMIN / TEACHER)
====================================================== */
exports.evaluateSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marksObtained, feedback } = req.body;

        const submission = await Submission.findOne({
            _id: submissionId,
            instituteId: req.instituteId
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (marksObtained !== undefined) submission.marksObtained = marksObtained;
        if (feedback !== undefined) submission.feedback = feedback;

        submission.status = "graded";
        await submission.save();

        return res.status(200).json({
            message: "Submission evaluated successfully",
            submission
        });

    } catch (error) {
        console.error("Evaluate submission error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
