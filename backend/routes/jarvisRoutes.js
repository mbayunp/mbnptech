// backend/routes/jarvisRoutes.js
const express = require('express');
const router = express.Router();

// Import controller Jarvis yang sudah kita buat sebelumnya
const { askJarvis } = require('../controllers/jarvisController');

// Import middleware autentikasi (wajib login)
const { protect } = require('../middleware/authMiddleware');

// Kunci semua rute Jarvis hanya untuk user yang terautentikasi
router.use(protect);

// ==========================================
// ENDPOINT AI JARVIS
// ==========================================

// Endpoint POST untuk menerima pertanyaan teks/perintah dari frontend
// URL jadinya nanti: POST /api/jarvis/ask
router.post('/ask', askJarvis);

// (Opsional untuk masa depan) Endpoint untuk menerima perintah suara langsung
// router.post('/audio', processJarvisAudio);

module.exports = router;