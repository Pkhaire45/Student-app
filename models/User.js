module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    registrationTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active'
    },
    standard: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    stream: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    // 🔥 NEW FELDS I🔥
    contactNumber: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    guardianName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    guardianContactNumber: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    guardianRelation: {
      type: DataTypes.STRING(30),
      allowNull: true
    }

  }, {
    tableName: 'users',
    timestamps: true // adds createdAt and updatedAt automatically
  });


  return User;
};
