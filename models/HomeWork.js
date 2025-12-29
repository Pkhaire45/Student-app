module.exports = (sequelize, DataTypes) => {
  const HomeWork = sequelize.define(
    "HomeWork",
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

      workDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
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
      tableName: "homeworks",
      timestamps: true
    }
  );

  HomeWork.associate = (models) => {
    HomeWork.belongsTo(models.Batch, {
      foreignKey: "batchId",
      as: "batch"
    });

    HomeWork.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator"
    });
  };

  return HomeWork;
};
