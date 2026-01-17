const Assignment = require("../models/assignment");
const Submission = require("../models/Submission");
const Batch = require("../models/Batch");
const Student = require("../models/Student");

/* ======================================================
   CREATE ASSIGNMENT (ADMIN / TEACHER)
====================================================== */
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      dueDate,
      totalMarks,
      assignmentType,
      instructions,
      batchId
    } = req.body;

    if (!title || !subject || !dueDate || !totalMarks || !assignmentType || !batchId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // validate batch (institute-safe)
    const batch = await Batch.findOne({
      _id: batchId,
      instituteId: req.instituteId
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // attachments (Mongo-native)
    let attachments = [];
    if (req.files && Array.isArray(req.files)) {
      attachments = req.files.map(file => ({
        fileUrl: `/uploads/assignments/${file.filename}`
      }));
    }

    const assignment = await Assignment.create({
      instituteId: req.instituteId,
      batchId,
      createdBy: req.user.userId,
      title,
      description,
      subject,
      dueDate,
      totalMarks,
      assignmentType,
      instructions,
      attachments
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment
    });

  } catch (error) {
    console.error("Create assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ALL ASSIGNMENTS
   - ADMIN / TEACHER: all institute assignments
   - STUDENT: only batch assignments (active)
====================================================== */
exports.getAllAssignments = async (req, res) => {
  try {
    let filter = { instituteId: req.instituteId };

    if (req.user.role === "STUDENT") {
      const student = await Student.findOne({
        _id: req.user.userId,
        instituteId: req.instituteId
      });

      if (!student || !student.batchIds?.length) {
        return res.status(404).json({ message: "No batch assigned" });
      }

      filter.batchId = { $in: student.batchIds };
      filter.isActive = true;
    }

    const assignments = await Assignment.find(filter)
      .populate("batchId", "batchName standard")
      .sort({ dueDate: 1 });

    return res.status(200).json({ assignments });

  } catch (error) {
    console.error("Get assignments error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ASSIGNMENTS BY BATCH
====================================================== */
exports.getAssignmentsByBatch = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findOne({
      _id: batchId,
      instituteId: req.instituteId
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // student access check
    if (req.user.role === "STUDENT") {
      const student = await Student.findById(req.user.userId);
      if (!student.batchIds.includes(batchId)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const assignments = await Assignment.find({
      instituteId: req.instituteId,
      batchId,
      ...(req.user.role === "STUDENT" && { isActive: true })
    }).sort({ dueDate: 1 });

    return res.status(200).json({ assignments });

  } catch (error) {
    console.error("Get assignments by batch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ASSIGNMENT BY ID
====================================================== */
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      instituteId: req.instituteId
    }).populate("batchId", "batchName standard");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // student access check
    if (req.user.role === "STUDENT") {
      const student = await Student.findById(req.user.userId);
      if (!student.batchIds.includes(assignment.batchId._id.toString())) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    return res.status(200).json({ assignment });

  } catch (error) {
    console.error("Get assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE ASSIGNMENT (ADMIN / TEACHER)
====================================================== */
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      instituteId: req.instituteId
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // append new attachments
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        fileUrl: `/uploads/assignments/${file.filename}`
      }));
      assignment.attachments.push(...newFiles);
    }

    Object.assign(assignment, req.body);
    await assignment.save();

    return res.status(200).json({
      message: "Assignment updated successfully",
      assignment
    });

  } catch (error) {
    console.error("Update assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   DELETE ASSIGNMENT (ADMIN)
====================================================== */
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findOneAndDelete({
      _id: req.params.id,
      instituteId: req.instituteId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // optional: delete submissions
    await Submission.deleteMany({
      assignmentId: req.params.id,
      instituteId: req.instituteId
    });

    return res.status(200).json({
      message: "Assignment deleted successfully"
    });

  } catch (error) {
    console.error("Delete assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
