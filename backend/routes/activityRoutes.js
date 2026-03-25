// backend/routes/activityRoutes.js
const express = require('express');
const router = express.Router();

const { getActivities, clearActivities, deleteActivityLog } = require('../controllers/activityController'); 
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getActivities);
router.delete('/clear', clearActivities);
router.delete('/:id', deleteActivityLog);

module.exports = router;