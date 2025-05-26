module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    testTitle: DataTypes.STRING,
    description: DataTypes.TEXT,
    subject: DataTypes.STRING,
    class: DataTypes.STRING,
    duration: DataTypes.INTEGER, // duration in minutes
    dueDate: DataTypes.DATEONLY, // only date (YYYY-MM-DD)
    dueTime: DataTypes.TIME      // only time (HH:mm:ss)
  }, { tableName: 'Tests', timestamps: true });

  Test.associate = models => {
    Test.hasMany(models.Question, { foreignKey: 'testId', as: 'questions' });
  };

  return Test;
};