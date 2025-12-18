// app.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // For Admin & Student login routes
const studentRoutes = require('./routes/studentRoutes'); // For Student login routes
const { sequelize } = require('./models'); // Importing sequelize instance
const assignmentRoutes = require('./routes/assignmentRoutes'); 
const submissionRoutes = require('./routes/submissionRoutes'); // Importing submission routes
const batchRoutes = require('./routes/batchRoutes');
const classWorkRoutes = require('./routes/classWorkRoutes');
const homeWorkRoutes = require('./routes/homeWorkRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies
app.use('/uploads', express.static('uploads'));
// Routes
app.use('/api/admin', authRoutes); // Admin & Student login routes
app.use('/api/student', studentRoutes); // For student-specific routes
app.use('/api/assignments',assignmentRoutes ); 
app.use('/api/submissions', submissionRoutes);
app.use("/api/batches",batchRoutes);
app.use('/api/classworks', classWorkRoutes);
app.use('/api/homeworks', homeWorkRoutes);
 // Submission routes
// Assignment routes
// Test route to check if app is running
app.get('/', (req, res) => {
  res.send('App is up and running!');
});

module.exports = app; // Export the app for use in server.js
