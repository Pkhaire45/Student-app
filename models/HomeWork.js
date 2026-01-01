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

      // keep for backward compatibility
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
      tableName: "homeworks",
      timestamps: true,

      validate: {
        endAfterStart() {
          if (this.endDate < this.startDate) {
            throw new Error("endDate cannot be before startDate");
          }
        }
      }
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
