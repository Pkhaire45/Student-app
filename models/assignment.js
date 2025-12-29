module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    "Assignment",
    {
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
        type: DataTypes.STRING, // document / project / homework
        allowNull: false
      },

      attachments: {
        type: DataTypes.JSON,
        allowNull: true
      },

      instructions: {
        type: DataTypes.STRING,
        allowNull: true
      },

      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      // ✅ THIS is the key
      batchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "batches",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: "Assignments",
      timestamps: true
    }
  );

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Batch, {
      foreignKey: "batchId",
      as: "batch"
    });
  };

  return Assignment;
};
