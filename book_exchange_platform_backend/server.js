const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const { checkBlacklistedToken } = require('./middleware/tokenBlacklist');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Middleware to check for blacklisted tokens
app.use(checkBlacklistedToken);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// User Routes
app.use('/api/users', userRoutes);

// Book Routes
app.use('/api/books', bookRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`Error: ${err.message}`); 
  res.status(statusCode).json({ message: err.message }); 
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
