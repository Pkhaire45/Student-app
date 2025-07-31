const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

// ✅ Initialize Sequelize
const sequelize = new Sequelize({
  host: '13.203.203.147',
  dialect: 'mysql',
  username: 'studentuser',
  password: 'Student@1234',
  database: 'studentdb',
});

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const modelImport = require(path.join(__dirname, file));

    if (typeof modelImport !== 'function') {
      throw new Error(
        `❌ Model file "${file}" does not export a function: module.exports = (sequelize, DataTypes) => { ... }`
      );
    }

    const model = modelImport(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


// ✅ Call associate() for each model
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db); // This sets up associations like Test.hasMany(Question)
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
