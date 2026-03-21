// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const financeRoutes = require('./routes/financeRoutes');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const lifeRoutes = require('./routes/lifeRoutes');
const activityRoutes = require('./routes/activityRoutes');
const spiritualRoutes = require('./routes/spiritualRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Gunakan Routes
app.use('/api/auth', authRoutes);

// Gunakan Routes
app.use('/api/finances', financeRoutes);
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/life', require('./routes/lifeRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/spiritual', spiritualRoutes);
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/settings', settingsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/dashboard', dashboardRoutes);


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