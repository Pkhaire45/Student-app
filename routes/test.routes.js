const express = require("express");
const router = express.Router();

const testController = require("../controllers/test.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");

// ➕ Create test (ADMIN / TEACHER)
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  testController.createTest
);

// 📚 Get tests (role-aware)
router.get(
  "/",
  auth,
  testController.getTests
);

// � Get all submissions for a test (ADMIN / TEACHER)
router.get(
  "/:testId/submissions",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  testController.getAllTestSubmissions
);

// �📦 Get tests by batch ID
router.get(
  "/batch/:batchId",
  auth,
  testController.getTestsByBatchId
);

// ℹ️ Get test by ID
router.get(
  "/:testId",
  auth,
  testController.getTestById
);

// ✏️ Update test (ADMIN / TEACHER)
router.put(
  "/:testId",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  testController.updateTest
);

// 🗑️ Delete test (ADMIN / TEACHER)
router.delete(
  "/:testId",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  testController.deleteTest
);

module.exports = router;
