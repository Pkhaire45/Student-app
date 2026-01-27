const express = require("express");
const router = express.Router();

const assignmentController = require("../controllers/assignment.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

// protect all assignment routes
router.use(auth);

// ➕ create assignment
router.post(
  "/",
  roleGuard("ADMIN", "TEACHER"),
  upload.array("files"),
  assignmentController.createAssignment
);

// 📄 get all assignments
router.get(
  "/",
  assignmentController.getAllAssignments
);

// 📄 get assignments by batch
router.get(
  "/batch/:batchId",
  assignmentController.getAssignmentsByBatch
);

// 📄 get assignment by id
router.get(
  "/:id",
  assignmentController.getAssignmentById
);

// ✏️ update assignment
router.put(
  "/:id",
  roleGuard("ADMIN", "TEACHER"),
  assignmentController.updateAssignment
);

// 🗑️ delete assignment
router.delete(
  "/:id",
  roleGuard("ADMIN"),
  assignmentController.deleteAssignment
);

module.exports = router;
