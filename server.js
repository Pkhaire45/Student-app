// server.js

const app = require('./app'); // Import the Express app from app.js
const { sequelize } = require('./models'); // Import the sequelize instance

// Port configuration
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, async () => {
  try {
    // Sync Sequelize models with the database
    await sequelize.sync({ force: false }); // Set `force: true` to reset the database on each start, or `false` to avoid it
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});
