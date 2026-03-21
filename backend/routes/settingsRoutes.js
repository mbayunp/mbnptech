// backend/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
  getAllSettings, updateProfile, updateSystemSettings, 
  updateSpiritualSettings, updatePassword, exportUserData 
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

// --- KONFIGURASI MULTER UNTUK UPLOAD FOTO PROFIL ---
// Pastikan folder uploads/profiles ada
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate nama file unik: profil-userId-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profil-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
  fileFilter: (req, file, cb) => {
    // Hanya izinkan format gambar
    const fileTypes = /jpeg|jpg|png|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya diperbolehkan mengunggah file gambar (JPEG, JPG, PNG, WEBP)'));
    }
  }
});

// --- ROUTES ---
router.use(protect); // Semua fitur setting wajib login

router.get('/', getAllSettings);

// Gunakan upload.single('profile_picture') untuk menangkap field file bernama 'profile_picture'
router.put('/profile', upload.single('profile_picture'), updateProfile);

router.put('/system', updateSystemSettings);
router.put('/spiritual', updateSpiritualSettings);
router.put('/security/password', updatePassword);
router.get('/export', exportUserData);

module.exports = router;