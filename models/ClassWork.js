module.exports = (sequelize, DataTypes) => {
  const ClassWork = sequelize.define(
    "ClassWork",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      // NEW
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      // NEW
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      // (Optional) keep workDate for backward compatibility
      workDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "classworks",
      timestamps: true
    }
  );

  ClassWork.associate = (models) => {
    ClassWork.belongsTo(models.Batch, {
      foreignKey: "batchId",
      as: "batch"
    });

    ClassWork.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator"
    });
  };

  return ClassWork;
};
