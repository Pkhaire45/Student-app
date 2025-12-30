const { ClassWork, Batch, User } = require("../models");

/* =========================
   ADD CLASSWORK (ADMIN / TEACHER)
========================= */
exports.addClassWork = async (req, res) => {
  try {
    const { batchId, workDate, description } = req.body;
    const createdBy = req.user.id;

    if (!batchId || !workDate || !description) {
      return res.status(400).json({ message: "batchId, workDate and description are required" });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const classWork = await ClassWork.create({
      batchId,
      workDate,
      description,
      createdBy
    });

    return res.status(201).json({
      message: "Classwork added successfully",
      classWork
    });

  } catch (err) {
    console.error("Add classwork error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   UPDATE CLASSWORK (ADMIN / TEACHER)
========================= */
exports.updateClassWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { workDate, description } = req.body;

    const classWork = await ClassWork.findByPk(id);
    if (!classWork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    await classWork.update({
      workDate,
      description
    });

    return res.json({
      message: "Classwork updated successfully",
      classWork
    });

  } catch (err) {
    console.error("Update classwork error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   DELETE CLASSWORK (ADMIN / TEACHER)
========================= */
exports.deleteClassWork = async (req, res) => {
  try {
    const { id } = req.params;

    const classWork = await ClassWork.findByPk(id);
    if (!classWork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    await classWork.destroy();

    return res.json({ message: "Classwork deleted successfully" });

  } catch (err) {
    console.error("Delete classwork error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   GET CLASSWORK BY ID
========================= */
exports.getClassWorkById = async (req, res) => {
  try {
    const classWork = await ClassWork.findByPk(req.params.id, {
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "batchName"]
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName"]
        }
      ]
    });

    if (!classWork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    return res.json(classWork);

  } catch (err) {
    console.error("Get classwork by id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   GET CLASSWORK BY BATCH
========================= */
exports.getClassWorkByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const data = await ClassWork.findAll({
      where: { batchId },
      order: [["workDate", "DESC"]]
    });

    return res.json({
      total: data.length,
      classworks: data
    });

  } catch (err) {
    console.error("Get classwork by batch error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* =========================
   GET CLASSWORK BY BATCH + DATE
========================= */
exports.getClassWorkByBatchAndDate = async (req, res) => {
  try {
    const { batchId, date } = req.params;

    const data = await ClassWork.findAll({
      where: {
        batchId,
        workDate: date
      }
    });

    return res.json({
      total: data.length,
      classworks: data
    });

  } catch (err) {
    console.error("Get classwork by batch and date error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getClassWorks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      batchId,
      date
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};

    if (batchId) where.batchId = batchId;
    if (date) where.workDate = date;

    const { count, rows } = await ClassWork.findAndCountAll({
      where,
      include: [
        {
          model: Batch,
          as: "batch",
          attributes: ["id", "batchName"]
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "fullName"]
        }
      ],
      order: [["workDate", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      classworks: rows
    });

  } catch (err) {
    console.error("Get all classworks error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};