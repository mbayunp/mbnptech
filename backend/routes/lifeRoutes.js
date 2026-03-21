// backend/routes/lifeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getLifePlans, updateLifePlan, addLifePlan, deleteLifePlan,
  getVision, updateVision,
  getHabits, toggleHabitLog, addHabit, updateHabit, deleteHabit,
  getAchievements, addAchievement, deleteAchievement
} = require('../controllers/lifeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Semua route butuh otentikasi

// --- VISI & MISI (BARU) ---
router.route('/vision').get(getVision).put(updateVision);

// --- Life Plan Routes ---
router.route('/plans').get(getLifePlans).post(addLifePlan);
router.route('/plans/:id').put(updateLifePlan).delete(deleteLifePlan);

// --- Habits Routes ---
router.route('/habits').get(getHabits).post(addHabit);
router.post('/habits/toggle', toggleHabitLog);
router.route('/habits/:id').put(updateHabit).delete(deleteHabit);

// --- Achievements Routes ---
router.route('/achievements').get(getAchievements).post(addAchievement);
router.route('/achievements/:id').delete(deleteAchievement);

module.exports = router;