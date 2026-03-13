// backend/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const { getActivities, clearActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getActivities);
router.delete('/clear', clearActivities);

module.exports = router;