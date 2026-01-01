const { ClassWork, Batch, User } = require("../models");
const { Op } = require("sequelize");

/* =========================
   ADD CLASSWORK (ADMIN / TEACHER)
========================= */
exports.addClassWork = async (req, res) => {
  try {
    const { batchId, startDate, endDate, description } = req.body;
    const createdBy = req.user.id;

    if (!batchId || !startDate || !endDate || !description) {
      return res.status(400).json({
        message: "batchId, startDate, endDate and description are required"
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "endDate cannot be before startDate"
      });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const classWork = await ClassWork.create({
      batchId,
      startDate,
      endDate,
      // optional backward compatibility
      workDate: startDate,
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
    const { startDate, endDate, description } = req.body;

    const classWork = await ClassWork.findByPk(id);
    if (!classWork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "endDate cannot be before startDate"
      });
    }

    await classWork.update({
      startDate,
      endDate,
      // keep workDate in sync if needed
      workDate: startDate || classWork.workDate,
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
      order: [["startDate", "DESC"]]
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
   GET CLASSWORK BY BATCH + DATE (DATE RANGE)
========================= */
exports.getClassWorkByBatchAndDate = async (req, res) => {
  try {
    const { batchId, date } = req.params;

    const data = await ClassWork.findAll({
      where: {
        batchId,
        startDate: { [Op.lte]: date },
        endDate: { [Op.gte]: date }
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

/* =========================
   GET CLASSWORKS (FILTER + PAGINATION)
========================= */
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

    // date inside range
    if (date) {
      where.startDate = { [Op.lte]: date };
      where.endDate = { [Op.gte]: date };
    }

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
      order: [["startDate", "DESC"]],
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
