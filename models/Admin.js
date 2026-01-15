const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
    index: true
  },
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "ADMIN" }
}, { timestamps: true });

adminSchema.index({ email: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model("Admin", adminSchema);
