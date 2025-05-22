// server.js

const app = require('./app'); // Import the Express app from app.js
const { sequelize } = require('./models'); // Import the sequelize instance

// Port configuration
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, '127.0.0.1', async () => {
  try {
    await sequelize.sync({ force: false });
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});

