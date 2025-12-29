module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define(
    "Submission",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Assignments",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

      submitted_files: {
        type: DataTypes.JSON,
        allowNull: true
      },

      submission_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },

      // 👇 grading fields
      marks_obtained: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      feedback: {
        type: DataTypes.STRING,
        allowNull: true
      },

      // 👇 workflow control
      status: {
        type: DataTypes.ENUM("submitted", "late", "graded", "resubmitted"),
        defaultValue: "submitted"
      }
    },
    {
      tableName: "Submissions",
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["assignment_id", "student_id"]
        }
      ]
    }
  );

  Submission.associate = models => {
    Submission.belongsTo(models.Assignment, {
      foreignKey: "assignment_id",
      as: "assignment"
    });

    Submission.belongsTo(models.User, {
      foreignKey: "student_id",
      as: "student"
    });
  };

  return Submission;
};
