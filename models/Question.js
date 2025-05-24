module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    testId: DataTypes.INTEGER,
    questionText: DataTypes.TEXT,
    correctOption: DataTypes.INTEGER
  }, { tableName: 'Questions', timestamps: true });

  Question.associate = models => {
    Question.belongsTo(models.Test, { foreignKey: 'testId' });
    Question.hasMany(models.Option, { foreignKey: 'questionId', as: 'options' });
  };

  return Question;
};