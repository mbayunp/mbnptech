// backend/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getTodoData, 
  addTask, 
  updateTaskStatus, 
  deleteTask, 
  completePomodoro 
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// Semua rute Todo wajib login
router.use(protect); 

router.route('/')
  .get(getTodoData)
  .post(addTask);

router.route('/:id')
  .put(updateTaskStatus)
  .delete(deleteTask);

router.post('/pomodoro', completePomodoro);

module.exports = router;