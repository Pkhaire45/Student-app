const express = require("express");
const router = express.Router();

const homeWorkController = require("../controllers/homework.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");
const uploadFactory = require("../middleware/uploadFactory");

// Configure upload middleware for homework
const upload = uploadFactory("homework");

// Protect all routes
router.use(auth);

// ➕ Create Homework (Admin/Teacher)
router.post(
    "/",
    roleGuard("ADMIN", "TEACHER"),
    upload.array("attachments", 5), // Max 5 files
    homeWorkController.createHomeWork
);

// 📄 Get All Homework
router.get(
    "/",
    homeWorkController.getAllHomeWork
);

// 📄 Get Homework by Batch
router.get(
    "/batch/:batchId",
    homeWorkController.getHomeWorkByBatch
);

// 📄 Get Single Homework
router.get(
    "/:id",
    homeWorkController.getHomeWorkById
);

// ✏️ Update Homework (Admin/Teacher)
router.put(
    "/:id",
    roleGuard("ADMIN", "TEACHER"),
    upload.array("attachments", 5),
    homeWorkController.updateHomeWork
);

// 🗑️ Delete Homework (Admin/Teacher)
router.delete(
    "/:id",
    roleGuard("ADMIN", "TEACHER"),
    homeWorkController.deleteHomeWork
);

module.exports = router;
