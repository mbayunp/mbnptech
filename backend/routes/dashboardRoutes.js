const express = require('express');
const router = express.Router();
const { getDashboardSummary, getDashboardHeatmap } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getDashboardSummary);
router.get('/heatmap', protect, getDashboardHeatmap);

module.exports = router;