const Teacher = require("../models/Teacher");

exports.createTeacher = async (req, res) => {
  const exists = await Teacher.findOne({
    username: req.body.username,
    instituteId: req.instituteId
  });

  if (exists) {
    return res.status(400).json({ message: "Username exists" });
  }

  const teacher = await Teacher.create({
    ...req.body,
    instituteId: req.instituteId
  });

  res.status(201).json(teacher);
};

exports.getTeachers = async (req, res) => {
  const teachers = await Teacher.find({
    instituteId: req.instituteId
  }).select("-password");

  res.json(teachers);
};
