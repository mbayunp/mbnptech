// backend/routes/financeRoutes.js
const express = require('express');
const router = express.Router();
const { addQuickFinance, payDebt, getFullFinanceStats } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

// 🔓 ROUTE PUBLIK: Tidak butuh token JWT (Keamanannya diatur oleh PIN di Frontend)
router.post('/quick', addQuickFinance);

// 🔒 ROUTE PRIVATE: Wajib pakai Token JWT (Hanya bisa diakses dari dalam Dashboard)
router.post('/pay-debt', protect, payDebt);
router.get('/full-stats', protect, getFullFinanceStats);

module.exports = router;