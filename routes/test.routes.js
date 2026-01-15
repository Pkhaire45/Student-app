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

// 📊 Get all submissions for a test (ADMIN / TEACHER)
router.get(
  "/:testId/submissions",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  testController.getAllTestSubmissions
);

module.exports = router;
