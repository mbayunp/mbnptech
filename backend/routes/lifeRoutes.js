const express = require('express');
const router = express.Router();
const {
  getLifePlans, updateLifePlan, addLifePlan, deleteLifePlan,
  getHabits, toggleHabitLog, addHabit, updateHabit, deleteHabit,
  getAchievements, addAchievement, deleteAchievement
} = require('../controllers/lifeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Life Plan Routes
router.route('/plans').get(getLifePlans).post(addLifePlan);
router.route('/plans/:id').put(updateLifePlan).delete(deleteLifePlan);

// Habits Routes
router.route('/habits').get(getHabits).post(addHabit);
router.post('/habits/toggle', toggleHabitLog);
router.route('/habits/:id').put(updateHabit).delete(deleteHabit);

// Achievements Routes
router.route('/achievements').get(getAchievements).post(addAchievement);
router.route('/achievements/:id').delete(deleteAchievement);

module.exports = router;