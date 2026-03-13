// backend/controllers/todoController.js
const db = require('../config/db');
// Import logActivity dari activityController
const { logActivity } = require('./activityController');

const getTodoData = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    
    const [tasks] = await dbPromise.query(
      'SELECT id, title, category, priority, status, target_pomo as targetPomo, completed_pomo as completedPomo, deadline FROM tasks WHERE user_id = ? ORDER BY created_at DESC', 
      [userId]
    );

    const [statsRaw] = await dbPromise.query(`
      SELECT DATE_FORMAT(created_at, '%a') as day_name, COUNT(*) as total_sessions 
      FROM pomodoro_sessions 
      WHERE user_id = ? AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at), day_name
      ORDER BY DATE(created_at) ASC
    `, [userId]);

    const chartData = [
      { name: 'Mon', focus: 0 }, { name: 'Tue', focus: 0 }, { name: 'Wed', focus: 0 },
      { name: 'Thu', focus: 0 }, { name: 'Fri', focus: 0 }, { name: 'Sat', focus: 0 }, { name: 'Sun', focus: 0 }
    ];

    statsRaw.forEach(row => {
      const index = chartData.findIndex(d => d.name === row.day_name);
      if (index !== -1) chartData[index].focus = row.total_sessions;
    });

    res.status(200).json({ success: true, data: { tasks, chartData } });
  } catch (error) {
    console.error('Error fetching Todo:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const addTask = async (req, res) => {
  const { title, category, priority, deadline, targetPomo } = req.body;
  const userId = req.user.id;
  try {
    const query = 'INSERT INTO tasks (user_id, title, category, priority, deadline, target_pomo) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.promise().query(query, [userId, title, category, priority, deadline, targetPomo]);
    
    // --- LOG ACTIVITY ---
    await logActivity(userId, 'todo', 'create', 'Task Baru Dibuat', `Menambahkan task: ${title}`, { priority, category });

    res.status(201).json({ success: true, message: 'Task dibuat', taskId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambah task' });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, req.params.id, userId]);
    
    // --- LOG ACTIVITY ---
    const statusText = status === 'done' ? 'diselesaikan' : status === 'in_progress' ? 'dikerjakan' : 'dikembalikan ke To Do';
    const actionType = status === 'done' ? 'complete' : 'update';
    
    await logActivity(userId, 'todo', actionType, 'Status Task Diperbarui', `Task dipindah menjadi status: ${statusText}.`);

    res.status(200).json({ success: true, message: 'Status diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update status' });
  }
};

const deleteTask = async (req, res) => {
  const userId = req.user.id;
  try {
    await db.promise().query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, userId]);
    
    // --- LOG ACTIVITY ---
    await logActivity(userId, 'todo', 'delete', 'Task Dihapus', 'Satu task telah dihapus dari board.');

    res.status(200).json({ success: true, message: 'Task dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus task' });
  }
};

const completePomodoro = async (req, res) => {
  const { taskId, duration } = req.body; 
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    
    await dbPromise.query('INSERT INTO pomodoro_sessions (user_id, task_id, duration) VALUES (?, ?, ?)', [userId, taskId || null, duration]);
    
    if (taskId) {
      await dbPromise.query('UPDATE tasks SET completed_pomo = completed_pomo + 1 WHERE id = ? AND user_id = ?', [taskId, userId]);
    }
    
    // --- LOG ACTIVITY ---
    const minutes = Math.floor(duration / 60);
    await logActivity(userId, 'todo', 'complete', 'Pomodoro Selesai 🍅', `Menyelesaikan sesi fokus selama ${minutes} menit.`);

    res.status(200).json({ success: true, message: 'Sesi fokus dicatat!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mencatat pomodoro' });
  }
};

module.exports = { getTodoData, addTask, updateTaskStatus, deleteTask, completePomodoro };