// backend/routes/lifeRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getLifePlans, updateLifePlan, addLifePlan, deleteLifePlan,
  getHabits, toggleHabitLog, 
  getAchievements, addAchievement 
} = require('../controllers/lifeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); 

// Life Plan Routes
router.route('/plans')
  .get(getLifePlans)
  .post(addLifePlan);

router.route('/plans/:id')
  .put(updateLifePlan)
  .delete(deleteLifePlan);

// Habits Routes
router.get('/habits', getHabits);
router.post('/habits/toggle', toggleHabitLog);

// Achievements Routes
router.route('/achievements')
  .get(getAchievements)
  .post(addAchievement);

module.exports = router;