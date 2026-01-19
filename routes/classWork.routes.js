const express = require("express");
const router = express.Router();

const classWorkController = require("../controllers/classWork.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");
const uploadFactory = require("../middleware/uploadFactory");

// Configure upload middleware for classwork
const upload = uploadFactory("classworks");

// Protect all routes
router.use(auth);

// ➕ Create ClassWork (Admin/Teacher)
router.post(
    "/",
    roleGuard("ADMIN", "TEACHER"),
    upload.array("attachments", 5), // Max 5 files
    classWorkController.createClassWork
);

// 📄 Get All ClassWork
router.get(
    "/",
    classWorkController.getAllClassWork
);

// 📄 Get ClassWork by Batch
router.get(
    "/batch/:batchId",
    classWorkController.getClassWorkByBatch
);

// 📄 Get Single ClassWork
router.get(
    "/:id",
    classWorkController.getClassWorkById
);

// ✏️ Update ClassWork (Admin/Teacher)
router.put(
    "/:id",
    roleGuard("ADMIN", "TEACHER"),
    upload.array("attachments", 5),
    classWorkController.updateClassWork
);

// 🗑️ Delete ClassWork (Admin/Teacher)
router.delete(
    "/:id",
    roleGuard("ADMIN", "TEACHER"),
    classWorkController.deleteClassWork
);

module.exports = router;
