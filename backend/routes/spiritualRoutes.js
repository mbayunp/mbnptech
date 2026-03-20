// backend/routes/spiritualRoutes.js
const express = require('express');
const router = express.Router();
const { getSpiritualData, toggleIbadah, toggleAmalan, updateQuran, addDoa, deleteDoa, updateReflection, updateHistory } = require('../controllers/spiritualController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSpiritualData);
router.post('/ibadah', toggleIbadah);
router.post('/amalan', toggleAmalan);
router.post('/quran', updateQuran);
router.post('/doa', addDoa);
router.delete('/doa/:id', deleteDoa);
router.post('/reflection', updateReflection);
router.put('/history', protect, updateHistory);
module.exports = router;