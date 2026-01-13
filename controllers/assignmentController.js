const { Assignment, User, Batch } = require("../models");

/* ======================================================
   CREATE ASSIGNMENT (Admin / Teacher)
   Assigns assignment to a batch
====================================================== */
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      due_date,
      total_marks,
      assignment_type,
      instructions,
      batchId
    } = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "batchId is required" });
    }


    // Handle attachments (ensure array or null, not string)
    let attachments = [];
    if (req.files && Array.isArray(req.files)) {
      attachments = req.files.map(file => ({
        file_name: file.originalname,
        file_url: `/uploads/assignments/${file.filename}`,
        file_type: file.mimetype,
        file_size: file.size
      }));
    }

    // If Assignment.attachments is a JSON/ARRAY type, store as array. If STRING, store as JSON string.
    let assignmentData = {
      title,
      description,
      subject,
      due_date,
      total_marks,
      assignment_type,
      instructions,
      batchId,
      created_by: req.user.id
    };
    // Check model definition if attachments is string or array/json
    // For safety, store as JSON string if not array
    if (Assignment.rawAttributes && Assignment.rawAttributes.attachments && Assignment.rawAttributes.attachments.type && Assignment.rawAttributes.attachments.type.key === 'STRING') {
      assignmentData.attachments = JSON.stringify(attachments);
    } else {
      assignmentData.attachments = attachments;
    }

    const assignment = await Assignment.create(assignmentData);

    return res.status(201).json({
      message: "Assignment created and assigned to batch",
      assignment
    });

  } catch (error) {
    console.error("Create assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ALL ASSIGNMENTS
   - Admin / Teacher: all assignments
   - Student: only assignments from their batch(es)
====================================================== */
const getAllAssignments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let whereClause = {};

    if (role === "student") {
      const student = await User.findByPk(userId, {
        include: {
          model: Batch,
          through: { attributes: [] }
        }
      });

      if (!student?.Batches?.length) {
        return res.status(404).json({ message: "No batch assigned" });
      }

      whereClause.batchId = student.Batches.map(b => b.id);
      whereClause.is_active = true;
    }

    const assignments = await Assignment.findAll({
      where: whereClause,
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "batchName", "standard"]
        }
      ],
      order: [["due_date", "ASC"]]
    });

    return res.status(200).json({ assignments });

  } catch (error) {
    console.error("Get assignments error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAssignmentsByBatch = async (req, res) => {
  const { batchId } = req.params;

  if (!batchId) {
    return res.status(400).json({ message: "batchId parameter is required" });
  }

  try {
    // Ensure batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Students can only access assignments for their own batch(es)
    const whereClause = { batchId };
    if (req.user?.role === "student") {
      const student = await User.findByPk(req.user.id, {
        include: {
          model: Batch,
          through: { attributes: [] }
        }
      });

      if (!student || !student.Batches?.length) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const studentBatchIds = student.Batches.map(b => b.id.toString());
      if (!studentBatchIds.includes(batchId.toString())) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Only show active assignments to students
      whereClause.is_active = true;
    }

    const assignments = await Assignment.findAll({
      where: whereClause,
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "batchName", "standard"]
        }
      ],
      order: [["due_date", "ASC"]]
    });

    return res.status(200).json({ assignments });

  } catch (error) {
    console.error("Get assignments by batch error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ASSIGNMENT BY ID
   - Student can access only if belongs to the batch
====================================================== */
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: Batch, as: "batch" }]
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Student access validation
    if (req.user.role === "student") {
      const student = await User.findByPk(req.user.id, {
        include: {
          model: Batch,
          through: { attributes: [] }
        }
      });

      const allowedBatchIds = student.Batches.map(b => b.id);
      if (!allowedBatchIds.includes(assignment.batchId)) {
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
   UPDATE ASSIGNMENT
   - Admin / Teacher only
====================================================== */
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Handle attachments
    let attachments = assignment.attachments || [];

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        file_name: file.originalname,
        file_url: `/uploads/assignments/${file.filename}`,
        file_type: file.mimetype,
        file_size: file.size
      }));
      attachments = attachments.concat(newFiles);
    }

    await assignment.update({
      ...req.body,
      attachments
    });

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
   DELETE ASSIGNMENT
====================================================== */
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await assignment.destroy();

    return res.status(200).json({ message: "Assignment deleted successfully" });

  } catch (error) {
    console.error("Delete assignment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentsByBatch,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};
