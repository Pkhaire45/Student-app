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

// ℹ️ Get teacher by ID (ADMIN)
router.get(
  "/:teacherId",
  auth,
  roleGuard("ADMIN"),
  teacherController.getTeacherById
);

// ✏️ Update teacher (ADMIN)
router.put(
  "/:teacherId",
  auth,
  roleGuard("ADMIN"),
  teacherController.updateTeacher
);

// 🗑️ Delete teacher (ADMIN)
router.delete(
  "/:teacherId",
  auth,
  roleGuard("ADMIN"),
  teacherController.deleteTeacher
);

module.exports = router;
