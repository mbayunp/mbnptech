// backend/controllers/lifeController.js
const db = require('../config/db');
// Import logActivity
const { logActivity } = require('./activityController');

// --- 1. LIFE PLANS ---
const getLifePlans = async (req, res) => {
    try {
        const [plans] = await db.promise().query('SELECT * FROM life_plans WHERE user_id = ? ORDER BY target_year ASC, id ASC', [req.user.id]);
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data Life Plan' });
    }
};

const updateLifePlan = async (req, res) => {
    const { title, description, progress, target_year, status } = req.body;
    try {
        await db.promise().query(
            'UPDATE life_plans SET title = ?, description = ?, progress = ?, target_year = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, progress, target_year, status, req.params.id, req.user.id]
        );
        
        // --- LOG ACTIVITY ---
        await logActivity(req.user.id, 'life_planning', 'update', 'Life Plan Diperbarui', `Target: ${title} diupdate.`);

        res.status(200).json({ success: true, message: 'Life Plan diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update Life Plan' });
    }
};

const addLifePlan = async (req, res) => {
  const { category, title, description, progress, target_year, status } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO life_plans (user_id, category, title, description, progress, target_year, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, category, title, description || null, progress || 0, target_year || null, status || 'upcoming']
    );
    
    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'life_planning', 'create', 'Life Plan Baru', `Menambahkan target baru: ${title}.`);

    res.status(201).json({ success: true, message: 'Life Plan ditambahkan!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambah Life Plan' });
  }
};

const deleteLifePlan = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM life_plans WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'life_planning', 'delete', 'Life Plan Dihapus', 'Satu target hidup telah dihapus dari sistem.');

    res.status(200).json({ success: true, message: 'Life Plan dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus Life Plan' });
  }
};

// --- 2. HABITS & TRACKER ---
const getHabits = async (req, res) => {
    try {
        const dbPromise = db.promise();
        const [habits] = await dbPromise.query('SELECT * FROM habits WHERE user_id = ?', [req.user.id]);

        // Ambil log/ceklis dalam 30 hari terakhir untuk heat map
        const [logs] = await dbPromise.query(`
      SELECT habit_id, DATE_FORMAT(log_date, '%Y-%m-%d') as log_date 
      FROM habit_logs 
      WHERE user_id = ? AND log_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    `, [req.user.id]);

        res.status(200).json({ success: true, data: { habits, logs } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil Habits' });
    }
};

const toggleHabitLog = async (req, res) => {
    const { habit_id, log_date } = req.body; 
    const userId = req.user.id;

    try {
        const dbPromise = db.promise();
        const [existing] = await dbPromise.query('SELECT id FROM habit_logs WHERE user_id = ? AND habit_id = ? AND log_date = ?', [userId, habit_id, log_date]);
        
        // Ambil nama habit untuk ditulis di log
        const [[habit]] = await dbPromise.query('SELECT title FROM habits WHERE id = ?', [habit_id]);

        if (existing.length > 0) {
            await dbPromise.query('DELETE FROM habit_logs WHERE id = ?', [existing[0].id]);
            
            // --- LOG ACTIVITY ---
            await logActivity(userId, 'habits', 'delete', 'Habit Batal Diceklis', `Membatalkan ceklis habit: ${habit?.title || 'Unknown'}.`);

            res.status(200).json({ success: true, action: 'removed' });
        } else {
            await dbPromise.query('INSERT INTO habit_logs (user_id, habit_id, log_date) VALUES (?, ?, ?)', [userId, habit_id, log_date]);
            
            // --- LOG ACTIVITY ---
            await logActivity(userId, 'habits', 'complete', 'Habit Selesai ✔️', `Menyelesaikan habit: ${habit?.title || 'Unknown'}.`);

            res.status(201).json({ success: true, action: 'added' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses habit log' });
    }
};

// --- 3. ACHIEVEMENTS ---
const getAchievements = async (req, res) => {
    try {
        const [achievements] = await db.promise().query('SELECT * FROM achievements WHERE user_id = ? ORDER BY achieved_year DESC, id DESC', [req.user.id]);
        res.status(200).json({ success: true, data: achievements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data Achievements' });
    }
};

const addAchievement = async (req, res) => {
    const { title, category, description, achieved_year } = req.body;
    try {
        await db.promise().query(
            'INSERT INTO achievements (user_id, title, category, description, achieved_year) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, category, description, achieved_year]
        );
        
        // --- LOG ACTIVITY ---
        await logActivity(req.user.id, 'achievements', 'create', 'Achievement Baru! 🏆', `Menambahkan pencapaian: ${title}.`);

        res.status(201).json({ success: true, message: 'Achievement ditambahkan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah Achievement' });
    }
};

module.exports = {
    getLifePlans, updateLifePlan, addLifePlan, deleteLifePlan,
    getHabits, toggleHabitLog,
    getAchievements, addAchievement,
};