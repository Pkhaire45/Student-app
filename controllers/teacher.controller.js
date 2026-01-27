const Teacher = require("../models/Teacher");
const Batch = require("../models/Batch");

/**
 * CREATE TEACHER (Admin Only)
 */
exports.createTeacher = async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      email,
      sex,
      dateOfBirth,
      contactNumber,
      address,
      teachingSubject,
      totalExperience,
      previousEmployer
    } = req.body;

    // 1️⃣ Validate required fields
    if (!fullName || !username || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Check if username already exists in this institute
    const exists = await Teacher.findOne({
      username,
      instituteId: req.instituteId
    });

    if (exists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 3️⃣ Create Teacher
    // Note: Password hashing is skipped to match existing Auth controller pattern. 
    // If you add hashing later, update it here too.
    const teacher = await Teacher.create({
      instituteId: req.instituteId,
      fullName,
      username,
      password, // Stored as plain text per existing codebase pattern
      email,
      sex,
      dateOfBirth,
      contactNumber,
      address,
      teachingSubject,
      totalExperience,
      previousEmployer
    });

    // 4️⃣ Assign Batches if provided
    if (req.body.batches && Array.isArray(req.body.batches) && req.body.batches.length > 0) {
      await Batch.updateMany(
        { _id: { $in: req.body.batches }, instituteId: req.instituteId },
        { $set: { teacherId: teacher._id } }
      );
    }

    // Return result without password
    teacher.password = undefined;

    return res.status(201).json({
      message: "Teacher created successfully",
      teacher
    });
  } catch (error) {
    console.error("Create teacher error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET ALL TEACHERS (Admin Only)
 */
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({
      instituteId: req.instituteId
    })
      .select("-password")
      .populate("batches", "batchName standard")
      .sort({ createdAt: -1 });

    return res.status(200).json({ teachers });
  } catch (error) {
    console.error("Get teachers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET TEACHER BY ID (Admin / Self?)
 */
exports.getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teacher.findOne({
      _id: teacherId,
      instituteId: req.instituteId
    })
      .select("-password")
      .populate("batches");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({ teacher });
  } catch (error) {
    console.error("Get teacher by ID error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE TEACHER (Admin Only)
 */
exports.updateTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const updates = req.body;

    // Prevent instituteId or password update via this general route if strict
    // For now, we allow updating everything except instituteId
    delete updates.instituteId;

    // Handle Batches Update
    if (updates.batches) {
      const newBatchIds = updates.batches;

      // Unassign all batches currently assigned to this teacher
      await Batch.updateMany(
        { teacherId: teacherId, instituteId: req.instituteId },
        { $unset: { teacherId: 1 } }
      );

      // Assign new batches
      if (Array.isArray(newBatchIds) && newBatchIds.length > 0) {
        await Batch.updateMany(
          { _id: { $in: newBatchIds }, instituteId: req.instituteId },
          { $set: { teacherId: teacherId } }
        );
      }

      // Remove batches from updates to avoid Schema errors (since it's a virtual)
      delete updates.batches;
    }

    // If password is being updated, we ideally hash it here, but keeping plain text
    // to match current auth.controller logic.

    const teacher = await Teacher.findOneAndUpdate(
      { _id: teacherId, instituteId: req.instituteId },
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("batches");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({
      message: "Teacher updated successfully",
      teacher
    });
  } catch (error) {
    console.error("Update teacher error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE TEACHER (Admin Only)
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await Teacher.findOneAndDelete({
      _id: teacherId,
      instituteId: req.instituteId
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // TODO: Clean up related data (assignments, etc.) if strict references exist.
    // Unassign batches from this teacher
    await Batch.updateMany({ teacherId: teacherId }, { $unset: { teacherId: 1 } });

    // For now, simple delete.

    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
