const { HomeWork, Batch, Subject } = require('../models');

/* =========================
   ADD HOMEWORK (ADMIN)
========================= */
exports.addHomeWork = async (req, res) => {
  try {
    const { batchId, subjectId, workDate, description } = req.body;
    const createdBy = req.user.id;

    if (!batchId || !subjectId || !workDate || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const batch = await Batch.findByPk(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    const subject = await Subject.findByPk(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const homeWork = await HomeWork.create({
      batchId,
      subjectId,
      workDate,
      description,
      createdBy
    });

    res.status(201).json({ message: 'Homework added', homeWork });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/* =========================
   UPDATE HOMEWORK (ADMIN)
========================= */
exports.updateHomeWork = async (req, res) => {
  const hw = await HomeWork.findByPk(req.params.id);
  if (!hw) return res.status(404).json({ message: 'Homework not found' });

  await hw.update(req.body);
  res.json({ message: 'Homework updated', hw });
};

/* =========================
   DELETE HOMEWORK (ADMIN)
========================= */
exports.deleteHomeWork = async (req, res) => {
  const hw = await HomeWork.findByPk(req.params.id);
  if (!hw) return res.status(404).json({ message: 'Homework not found' });

  await hw.destroy();
  res.json({ message: 'Homework deleted' });
};

/* =========================
   GET HOMEWORK BY ID
========================= */
exports.getHomeWorkById = async (req, res) => {
  const hw = await HomeWork.findByPk(req.params.id);
  if (!hw) return res.status(404).json({ message: 'Not found' });
  res.json(hw);
};

/* =========================
   GET HOMEWORK BY BATCH
========================= */
exports.getHomeWorkByBatch = async (req, res) => {
  const data = await HomeWork.findAll({
    where: { batchId: req.params.batchId },
    order: [['workDate', 'DESC']]
  });
  res.json({ total: data.length, homeworks: data });
};

/* =========================
   GET HOMEWORK BY BATCH + DATE
========================= */
exports.getHomeWorkByBatchAndDate = async (req, res) => {
  const data = await HomeWork.findAll({
    where: {
      batchId: req.params.batchId,
      workDate: req.params.date
    }
  });
  res.json({ total: data.length, homeworks: data });
};

/* =========================
   GET HOMEWORK BY SUBJECT
========================= */
exports.getHomeWorkBySubject = async (req, res) => {
  const data = await HomeWork.findAll({
    where: {
      batchId: req.params.batchId,
      subjectId: req.params.subjectId
    }
  });
  res.json({ total: data.length, homeworks: data });
};
