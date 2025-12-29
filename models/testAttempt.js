// models/testAttempt.js
module.exports = (sequelize, DataTypes) => {
  const TestAttempt = sequelize.define(
    "TestAttempt",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tests",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Questions",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      selectedOption: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 👇 IMPORTANT for real exams
      answeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "TestAttempts",
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["studentId", "testId", "questionId"],
        },
      ],
    }
  );

  TestAttempt.associate = (models) => {
    TestAttempt.belongsTo(models.User, {
      foreignKey: "studentId",
      as: "student",
    });

    TestAttempt.belongsTo(models.Test, {
      foreignKey: "testId",
      as: "test",
    });

    TestAttempt.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question",
    });
  };

  return TestAttempt;
};
