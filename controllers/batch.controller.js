const Batch = require("../models/Batch");
const Student = require("../models/Student");

/**
 * =========================
 * CREATE BATCH (ADMIN)
 * =========================
 */
exports.createBatch = async (req, res) => {
  try {
    const {
      batchName,
      standard,
      stream,
      academicYear,
      startDate,
      endDate
    } = req.body;

    if (!batchName || !standard || !academicYear || !startDate) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const batch = await Batch.create({
      instituteId: req.instituteId,
      batchName,
      standard,
      stream,
      academicYear,
      startDate,
      endDate
    });

    return res.status(201).json({
      message: "Batch created successfully",
      batch
    });
  } catch (error) {
    console.error("Create batch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * GET ALL BATCHES
 * =========================
 */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find({
      instituteId: req.instituteId
    }).sort({ createdAt: -1 });

    return res.status(200).json({ batches });
  } catch (error) {
    console.error("Get batches error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * GET BATCH BY ID (WITH STUDENTS)
 * =========================
 */
exports.getBatchDetailsById = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({
      _id: batchId,
      instituteId: req.instituteId
    }).populate({
      path: "studentIds",
      select: "fullName username email standard stream"
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    return res.status(200).json({ batch });
  } catch (error) {
    console.error("Get batch details error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * ADD STUDENTS TO BATCH
 * =========================
 */
exports.addStudentsToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { studentIds } = req.body;
    const instituteId = req.user.instituteId; // 🔥 JWT source

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: "studentIds must be a non-empty array"
      });
    }

    const batch = await Batch.findOne({
      _id: batchId,
      instituteId
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // validate students belong to same institute
    const students = await Student.find({
      _id: { $in: studentIds },
      instituteId
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        message: "One or more students are invalid"
      });
    }

    // 1️⃣ Update batch → add students
    await Batch.updateOne(
      { _id: batchId },
      { $addToSet: { studentIds: { $each: studentIds } } }
    );

    // 2️⃣ Update students → add batch
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { batchIds: batchId } }
    );

    return res.status(200).json({
      message: "Students added to batch successfully"
    });

  } catch (error) {
    console.error("Add students error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * =========================
 * UPDATE BATCH (ADMIN)
 * =========================
 */
/**
 * =========================
 * UPDATE BATCH (ADMIN)
 * =========================
 */
exports.updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const updates = req.body;

    // Prevent restricted fields from being updated
    delete updates.instituteId;
    delete updates.studentIds; // Students should be managed via add/remove endpoints
    delete updates._id;

    const batch = await Batch.findOneAndUpdate(
      {
        _id: batchId,
        instituteId: req.instituteId
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    return res.status(200).json({
      message: "Batch updated successfully",
      batch
    });
  } catch (error) {
    console.error("Update batch error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * =========================
 * DELETE BATCH (ADMIN)
 * =========================
 */
exports.deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    // 1️⃣ Find and delete batch
    const batch = await Batch.findOneAndDelete({
      _id: batchId,
      instituteId: req.instituteId
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // 2️⃣ Cleanup: Remove this batchId from students' records
    await Student.updateMany(
      { batchIds: batchId },
      {
        $pull: { batchIds: batchId },
        // Optional: specific standard/stream cleanup if tied to batch? No, just ID.
      }
    );

    return res.status(200).json({
      message: "Batch deleted successfully"
    });
  } catch (error) {
    console.error("Delete batch error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
