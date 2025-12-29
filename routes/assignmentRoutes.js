const express = require("express");
const router = express.Router();

const assignmentController = require("../controllers/assignmentController");
const upload = require("../middleware/fileUpload");
const auth = require("../middleware/authMiddleware");

// Create assignment
router.post(
  "/",
  auth,
  upload.array("attachments", 10),
  assignmentController.createAssignment
);

// Get all assignments
router.get(
  "/",
  auth,
  assignmentController.getAllAssignments
);

// Get assignment by id
router.get(
  "/:id",
  auth,
  assignmentController.getAssignmentById
);

// Update assignment
router.put(
  "/:id",
  auth,
  upload.array("attachments", 10),
  assignmentController.updateAssignment
);

// Delete assignment
router.delete(
  "/:id",
  auth,
  assignmentController.deleteAssignment
);

module.exports = router;
