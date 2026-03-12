const express = require('express');
const router = express.Router();
const { 
  addQuickFinance, getFullFinanceStats, 
  addDebt, updateDebt, deleteDebt, payDebt, 
  deleteTransaction, updateTransaction 
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/quick', addQuickFinance);

router.get('/full-stats', protect, getFullFinanceStats);

// CRUD Transaksi
router.delete('/transaction/:id', protect, deleteTransaction);
router.put('/transaction/:id', protect, updateTransaction);

// CRUD Multi-Hutang
router.post('/debt', protect, addDebt);                // Tambah
router.put('/debt/:id', protect, updateDebt);          // Edit
router.delete('/debt/:id', protect, deleteDebt);       // Hapus
router.post('/pay-debt', protect, payDebt);            // Bayar

module.exports = router;