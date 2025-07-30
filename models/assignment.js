module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignment_type: {
      type: DataTypes.STRING, // document/project/homework
      allowNull: false
    },
    attachments: {
      type: DataTypes.JSON, // Array of {file_name, file_url, file_type, file_size}
      allowNull: true
    },
    instructions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER, // admin_id
      allowNull: false
    },
    assigned_to: {
  type: DataTypes.JSON, // ✅ works in MySQL
  allowNull: false
}
,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
  
 


  return Assignment;
};