module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    contactNumber: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    teachingSubject: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    totalExperience: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    previousEmployer: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'Teachers',
    timestamps: true // adds createdAt and updatedAt automatically
  });

  return Teacher;
};