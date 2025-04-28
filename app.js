// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // For Admin & Student login routes
const studentRoutes = require('./routes/studentRoutes'); // For Student login routes
const { sequelize } = require('./models'); // Importing sequelize instance

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use('/api/admin', authRoutes); // Admin & Student login routes
app.use('/api/student', studentRoutes); // For student-specific routes

// Test route to check if app is running
app.get('/', (req, res) => {
  res.send('App is up and running!');
});

module.exports = app; // Export the app for use in server.js
