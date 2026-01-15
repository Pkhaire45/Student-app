const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },

    // 📤 Submitted files
    submittedFiles: [
      {
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    submissionTime: {
      type: Date,
      default: Date.now
    },

    // 📝 Grading
    marksObtained: {
      type: Number
    },

    feedback: {
      type: String
    },

    // 🔄 Workflow
    status: {
      type: String,
      enum: ["submitted", "late", "graded", "resubmitted"],
      default: "submitted"
    }
  },
  {
    timestamps: true
  }
);
