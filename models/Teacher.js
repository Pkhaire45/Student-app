const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null
    },

    dateOfBirth: Date,
    contactNumber: String,
    address: String,

    teachingSubject: String,
    totalExperience: String,
    previousEmployer: String,

    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema); // ✅ THIS WAS MISSING
