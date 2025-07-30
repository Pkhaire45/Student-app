module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Assignments', key: 'id' }
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    submitted_files: {
      type: DataTypes.JSON
    },
    submission_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    marks_obtained: {
      type: DataTypes.INTEGER
    },
    feedback: {
      type: DataTypes.STRING
    }
  });

  Submission.associate = models => {
    Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id' });
    Submission.belongsTo(models.User, { foreignKey: 'student_id' });
  };

  return Submission;
};
