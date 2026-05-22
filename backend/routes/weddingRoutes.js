// backend/routes/weddingRoutes.js
const express = require('express');
const router = express.Router();

// Mengimpor semua fungsi dari weddingController
const {
    getWeddingData,
    addBudget,
    deleteBudget,
    addExpense,
    addContribution,
    updateContribution, // <-- DITAMBAHKAN DI SINI
    deleteContribution, // <-- DITAMBAHKAN DI SINI
    addVendor,
    updateVendorStatus,
    addTimelineTask
} = require('../controllers/weddingController');

// Mengimpor middleware untuk mengamankan rute
const { protect } = require('../middleware/authMiddleware');

// Semua rute di bawah ini wajib menggunakan token (login)
router.use(protect);

// ==========================================
// DAFTAR ENDPOINT (RUTE) API WEDDING
// ==========================================

// Endpoint Utama (Mengambil semua data untuk Tab)
router.get('/', getWeddingData);

// Endpoint Budgets
router.post('/budgets', addBudget);
router.delete('/budgets/:id', deleteBudget);

// Endpoint Expenses (Pengeluaran)
router.post('/expenses', addExpense);

// Endpoint Contributions (Pemasukan)
router.post('/contributions', addContribution);
router.put('/contributions/:id', updateContribution);
router.delete('/contributions/:id', deleteContribution);

// Endpoint Vendors
router.post('/vendors', addVendor);
router.put('/vendors/:id/status', updateVendorStatus);

// Endpoint Timeline (Agenda)
router.post('/timeline', addTimelineTask);

// Export router agar bisa dipakai di server.js
module.exports = router;