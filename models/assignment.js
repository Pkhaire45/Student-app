const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant isolation
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true
    },

    // 🏫 Batch reference
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true
    },

    // 🧑‍🏫 Created by (Admin / Teacher)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // or Admin
      required: true
    },

    // 📝 Assignment details
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    subject: {
      type: String,
      required: true
    },

    dueDate: {
      type: Date,
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    assignmentType: {
      type: String, // document / project / homework
      required: true
    },

    instructions: {
      type: String
    },

    // 📎 Attachments (replaces WorkAttachment table)
    attachments: [
      {
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
