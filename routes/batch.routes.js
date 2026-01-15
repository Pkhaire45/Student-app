const express = require("express");
const router = express.Router();

const batchController = require("../controllers/batch.controller");
const auth = require("../middleware/auth.middleware");
const roleGuard = require("../middleware/role.middleware");

// 🔐 All batch routes are protected
router.use(auth);

// ➕ Create batch (ADMIN)
router.post(
  "/",
  roleGuard("ADMIN"),
  batchController.createBatch
);

// 📄 Get all batches
router.get(
  "/",
  batchController.getAllBatches
);

// 📄 Get batch details
router.get(
  "/:batchId",
  batchController.getBatchDetailsById
);

// ➕ Add students to batch (ADMIN)
router.post(
  "/:batchId/students",
  roleGuard("ADMIN"),
  batchController.addStudentsToBatch
);

// ✏️ Update batch (ADMIN)
router.put(
  "/:batchId",
  roleGuard("ADMIN"),
  batchController.updateBatch
);

// 🗑️ Delete batch (ADMIN)
router.delete(
  "/:batchId",
  roleGuard("ADMIN"),
  batchController.deleteBatch
);

module.exports = router;
