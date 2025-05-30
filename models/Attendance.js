module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    isPresent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    remark: { // Added remark field
      type: DataTypes.STRING,
      allowNull: true // Remark is optional
    }
  }, {
    tableName: 'Attendances',
    timestamps: true
  });

  Attendance.associate = models => {
    Attendance.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student'
    });
  };

  return Attendance;
};