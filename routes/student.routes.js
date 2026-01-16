const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");

router.post(
  "/register",
  auth,
  roleGuard("ADMIN"),
  studentController.registerStudent
);

// 🔐 Student login (plain password)
router.post("/login", studentController.studentLogin);

// 📚 Get tests for logged-in student
router.get(
  "/tests",
  auth,
  roleGuard("STUDENT"),
  studentController.getTestsForStudent
);

// 🧪 Submit / autosave test
router.post(
  "/solve-test",
  auth,
  roleGuard("STUDENT"),
  studentController.solveTest
);

// 📊 Get test result
router.get(
  "/test/:testId/result",
  auth,
  roleGuard("STUDENT"),
  studentController.getTestResult
);

module.exports = router;
