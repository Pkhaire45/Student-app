const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
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

    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    registrationDate: {
      type: Date,
      default: Date.now
    },

    registrationTime: String,

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },

    standard: String,
    year: String,
    stream: String,

    photo: String,
    contactNumber: String,
    dateOfBirth: Date,

    guardianName: String,
    guardianContactNumber: String,
    guardianRelation: String,

    batchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema); // ✅ REQUIRED
