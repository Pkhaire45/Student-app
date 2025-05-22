const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  host: '13.203.203.147',  // Your DB host
  dialect: 'mysql',   // Dialect (MySQL)
  username: 'studentuser',   // Your DB username
  password: 'Student@1234',       // Your DB password
  database: 'studentdb',   // Your DB name
});

const db = {};

// Dynamically load all models and instantiate them correctly
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')  // Skip the index.js file
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Fix: Use `model` class properly
    db[model.name] = model;
  });

// Set up model associations (if any)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;  // Export the db object, which contains the sequelize instance
