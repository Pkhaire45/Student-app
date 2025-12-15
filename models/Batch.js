module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define('Batch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    batchName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    standard: {
      type: DataTypes.STRING(30),
      allowNull: false
    },

    stream: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active'
    }

  }, {
    tableName: 'batches',
    timestamps: true
  });

  return Batch;
};
