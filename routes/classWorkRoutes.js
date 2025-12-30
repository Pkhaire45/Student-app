const express = require("express");
const router = express.Router();
const controller = require("../controllers/classWorkController");
const auth = require("../middleware/authMiddleware");

/**
 * =========================
 * WRITE ROUTES (AUTH ONLY)
 * =========================
 */
router.get("/", auth, controller.getClassWorks);

// Create classwork
router.post(
  "/",
  auth,
  controller.addClassWork
);

// Update classwork
router.put(
  "/:id",
  auth,
  controller.updateClassWork
);

// Delete classwork
router.delete(
  "/:id",
  auth,
  controller.deleteClassWork
);

/**
 * =========================
 * READ ROUTES (AUTH ONLY)
 * Order matters: specific → generic
 * =========================
 */

// Get classwork by batch + date
router.get(
  "/batch/:batchId/date/:date",
  auth,
  controller.getClassWorkByBatchAndDate
);

// Get classwork by batch
router.get(
  "/batch/:batchId",
  auth,
  controller.getClassWorkByBatch
);

// Get classwork by id (keep LAST)
router.get(
  "/:id",
  auth,
  controller.getClassWorkById
);

module.exports = router;
