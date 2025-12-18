module.exports = (sequelize, DataTypes) => {
  const WorkAttachment = sequelize.define('WorkAttachment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    workType: DataTypes.STRING,
    workId: DataTypes.INTEGER,
    fileUrl: DataTypes.STRING
  }, {
    tableName: 'work_attachments',
    timestamps: false
  });

  return WorkAttachment;
};
