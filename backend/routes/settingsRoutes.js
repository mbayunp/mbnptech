// backend/routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllSettings, updateProfile, updateSystemSettings, 
  updateSpiritualSettings, updatePassword, exportUserData 
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Semua fitur setting wajib login

router.get('/', getAllSettings);
router.put('/profile', updateProfile);
router.put('/system', updateSystemSettings);
router.put('/spiritual', updateSpiritualSettings);
router.put('/security/password', updatePassword);
router.get('/export', exportUserData);

module.exports = router;