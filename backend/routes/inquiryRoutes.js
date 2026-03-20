// backend/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();
const { getInquiries, updateInquiryStatus, deleteInquiry, addInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

// Rute Public (Untuk form di web public, tidak perlu login)
router.post('/', addInquiry);

// Rute Admin (Wajib login)
router.use(protect);
router.get('/', getInquiries);
router.put('/:id/status', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

module.exports = router;