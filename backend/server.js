// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const financeRoutes = require('./routes/financeRoutes');
const authRoutes = require('./routes/authRoutes');

// Gunakan Routes
app.use('/api/auth', authRoutes);

// Gunakan Routes
app.use('/api/finances', financeRoutes);

// Route Dasar
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to MBNP Tech API',
    status: 'Server is running perfectly 🚀'
  });
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});