const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");

// ➕ Create teacher (ADMIN only)
router.post(
  "/",
  auth,
  roleGuard("ADMIN"),
  teacherController.createTeacher
);

// 📄 Get all teachers (ADMIN)
router.get(
  "/",
  auth,
  roleGuard("ADMIN"),
  teacherController.getTeachers
);

module.exports = router;
