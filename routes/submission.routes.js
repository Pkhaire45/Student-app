const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submission.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");
const uploadFactory = require("../middleware/uploadFactory");

// Configure upload middleware for submissions
const upload = uploadFactory("submissions");

// protect all submission routes
router.use(auth);

// 📤 Submit Assignment (Student)
router.post(
    "/:assignmentId",
    roleGuard("STUDENT"),
    upload.array("files", 5), // Max 5 files
    submissionController.submitAssignment
);

// 📄 Get all submissions for an assignment (Teacher/Admin)
router.get(
    "/assignment/:assignmentId",
    roleGuard("ADMIN", "TEACHER"),
    submissionController.getSubmissionsByAssignment
);

// 📄 Get my submission for an assignment (Student)
router.get(
    "/assignment/:assignmentId/me",
    roleGuard("STUDENT"),
    submissionController.getMySubmission
);

// 📝 Evaluate Submission (Teacher/Admin)
router.put(
    "/:submissionId/evaluate",
    roleGuard("ADMIN", "TEACHER"),
    submissionController.evaluateSubmission
);

module.exports = router;
