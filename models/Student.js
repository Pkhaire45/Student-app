const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // 🔐 Institute scope
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    // A. Student Name
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    // Username (login)
    username: {
      type: String,
      required: true,
      trim: true
    },

    // C. Email ID
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    // L. Password
    password: {
      type: String,
      required: true,
      select: false
    },

    // B. Contact Number
    contactNumber: {
      type: String,
      trim: true
    },

    // D. Date of Birth
    dateOfBirth: {
      type: Date
    },

    // E. Gender
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    // F. Address
    address: {
      type: String,
      trim: true
    },

    // G. Standard/Class
    standard: {
      type: String
    },

    // Academic year (optional but useful)
    year: {
      type: String
    },

    // H. Admission for Subject
    subjects: [
      {
        type: String,
        trim: true
      }
    ],

    // I. Guardian Name
    guardianName: {
      type: String,
      trim: true
    },

    // J. Guardian Contact Number
    guardianContactNumber: {
      type: String,
      trim: true
    },

    // K. Relation with Guardian
    guardianRelation: {
      type: String,
      enum: ["Father", "Mother", "Other"]
    },

    // M. School / College Name
    institutionName: {
      type: String,
      trim: true
    },

    // N. School / College Address
    institutionAddress: {
      type: String,
      trim: true
    },

    // Extra (already useful)
    stream: String,
    photo: String,

    batchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch"
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },

    registrationDate: {
      type: Date,
      default: Date.now
    },

    registrationTime: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
