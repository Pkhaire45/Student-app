const { HomeWork, Batch, User } = require("../models");

/* =========================
   ADD HOMEWORK (ADMIN / TEACHER)
========================= */
exports.addHomeWork = async (req, res) => {
  try {
    const { batchId, workDate, description } = req.body;
    const createdBy = req.user.id;

    if (!batchId || !workDate || !description) {
      return res.status(400).json({
        message: "batchId, workDate and description are required"
      });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    const homeWork = await HomeWork.create({
      batchId,
      workDate,
      description,
      createdBy
    });

    return res.status(201).json({
      message: "Homework added successfully",
      homeWork
    });

  } catch (err) {
    console.error("Add homework error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================
   UPDATE HOMEWORK (ADMIN / TEACHER)
========================= */
exports.updateHomeWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { workDate, description } = req.body;

    const homeWork = await HomeWork.findByPk(id);
    if (!homeWork) {
      return res.status(404).json({ message: "Homework not found" });
    }

    await homeWork.update({
      workDate,
      description
    });

    return res.json({
      message: "Homework updated successfully",
      homeWork
    });

  } catch (err) {
    console.error("Update homework error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================
   DELETE HOMEWORK (ADMIN / TEACHER)
========================= */
exports.deleteHomeWork = async (req, res) => {
  try {
    const { id } = req.params;

    const homeWork = await HomeWork.findByPk(id);
    if (!homeWork) {
      return res.status(404).json({ message: "Homework not found" });
    }

    await homeWork.destroy();

    return res.json({ message: "Homework deleted successfully" });

  } catch (err) {
    console.error("Delete homework error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================
   GET HOMEWORK BY ID
========================= */
exports.getHomeWorkById = async (req, res) => {
  try {
    const homeWork = await HomeWork.findByPk(req.params.id, {
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

    if (!homeWork) {
      return res.status(404).json({ message: "Homework not found" });
    }

    return res.json(homeWork);

  } catch (err) {
    console.error("Get homework by id error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================
   GET HOMEWORK BY BATCH
========================= */
exports.getHomeWorkByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const data = await HomeWork.findAll({
      where: { batchId },
      order: [["workDate", "DESC"]]
    });

    return res.json({
      total: data.length,
      homeworks: data
    });

  } catch (err) {
    console.error("Get homework by batch error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* =========================
   GET HOMEWORK BY BATCH + DATE
========================= */
exports.getHomeWorkByBatchAndDate = async (req, res) => {
  try {
    const { batchId, date } = req.params;

    const data = await HomeWork.findAll({
      where: {
        batchId,
        workDate: date
      }
    });

    return res.json({
      total: data.length,
      homeworks: data
    });

  } catch (err) {
    console.error("Get homework by batch and date error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
