module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    questionId: DataTypes.INTEGER,
    optionText: DataTypes.STRING,
    optionNumber: DataTypes.INTEGER
  }, { tableName: 'Options', timestamps: true });

  Option.associate = models => {
    Option.belongsTo(models.Question, { foreignKey: 'questionId' });
  };

  return Option;
};