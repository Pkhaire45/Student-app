const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, index: true },
  status: { type: String, default: "ACTIVE" }
}, { timestamps: true });

module.exports = mongoose.model("Institute", instituteSchema);
