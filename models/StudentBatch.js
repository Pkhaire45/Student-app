module.exports = (sequelize, DataTypes) => {
  const StudentBatch = sequelize.define('StudentBatch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    joinedAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }

  }, {
    tableName: 'student_batches',
    timestamps: false
  });

  return StudentBatch;
};
