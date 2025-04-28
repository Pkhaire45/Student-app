// middleware/authMiddleware.js

require('dotenv').config(); // Load .env file
const jwt = require('jsonwebtoken');

// Secret key for JWT (now from .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request object (for further use)
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
