const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const multer = require("multer");
const auth = require("../middleware/authMiddleware");

const submissionUpload = multer({
  dest: "uploads/submissions/"
});

/* ======================================================
   STUDENT ROUTES
====================================================== */

// Submit assignment
router.post(
  "/",
  auth,
  submissionUpload.array("submitted_files"),
  submissionController.submitAssignment
);

// Get own submission for an assignment
router.get(
  "/assignment/:assignment_id/me",
  auth,
  submissionController.getSubmissionByStudent
);

/* ======================================================
   TEACHER / ADMIN ROUTES
   (auth only — role checks can be inside controller if needed)
====================================================== */

// Get all submissions for an assignment
router.get(
  "/assignment/:assignment_id",
  auth,
  submissionController.getSubmissionsByAssignment
);

// Grade submission
router.put(
  "/:id",
  auth,
  submissionController.updateSubmissionEvaluation
);

module.exports = router;
