// models/testAttempt.js
module.exports = (sequelize, DataTypes) => {
  const TestAttempt = sequelize.define('TestAttempt', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Table name for User model
        key: 'id',
      },
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tests',
        key: 'id',
      },
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Questions',
        key: 'id',
      },
    },
    selectedOption: {
      type: DataTypes.INTEGER, // The option number the student chose
      allowNull: false,
    },
  });

  return TestAttempt;
};