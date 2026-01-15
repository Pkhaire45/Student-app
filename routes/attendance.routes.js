const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");

// 📝 Mark attendance (ADMIN / TEACHER)
router.post(
  "/",
  auth,
  roleGuard("ADMIN", "TEACHER"),
  attendanceController.markAttendance
);

// 📊 Get attendance (ADMIN / TEACHER / STUDENT)
router.get(
  "/",
  auth,
  attendanceController.getAttendance
);

module.exports = router;
