module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      testTitle: DataTypes.STRING,
      description: DataTypes.TEXT,
      subject: DataTypes.STRING,
      class: DataTypes.STRING,
      duration: DataTypes.INTEGER, // minutes
      dueDate: DataTypes.DATEONLY,
      dueTime: DataTypes.TIME,

      // 👇 NEW
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "batches",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Tests",
      timestamps: true,
    }
  );

  Test.associate = (models) => {
    Test.hasMany(models.Question, {
      foreignKey: "testId",
      as: "questions",
    });

    // 👇 Test → Batch
    Test.belongsTo(models.Batch, {
      foreignKey: "batchId",
      as: "batch",
    });
  };

  return Test;
};
