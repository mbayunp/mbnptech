// backend/controllers/lifeController.js
const db = require('../config/db');
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

        await logActivity(req.user.id, 'life_planning', 'create', 'Life Plan Baru', `Menambahkan target baru: ${title}.`);
        res.status(201).json({ success: true, message: 'Life Plan ditambahkan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah Life Plan' });
    }
};

const deleteLifePlan = async (req, res) => {
    try {
        await db.promise().query('DELETE FROM life_plans WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        await logActivity(req.user.id, 'life_planning', 'delete', 'Life Plan Dihapus', 'Satu target hidup telah dihapus dari sistem.');
        res.status(200).json({ success: true, message: 'Life Plan dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus Life Plan' });
    }
};

// --- 2. VISI MISI (DENGAN AUTO-CREATE TABLE) ---
const getVision = async (req, res) => {
  const userId = req.user.id;
  const dbPromise = db.promise();

  try {
    // 🛠️ AUTO-CREATE TABLE JIKA BELUM ADA (Mencegah Error 500)
    await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS life_vision (
        user_id INT PRIMARY KEY,
        statement TEXT NOT NULL,
        values_list TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await dbPromise.query('SELECT statement, values_list FROM life_vision WHERE user_id = ?', [userId]);
    
    if (rows.length === 0) {
      // Jika user belum pernah mengatur visi, kirim data default kosong
      return res.status(200).json({ 
        success: true, 
        data: { 
          statement: 'Misi belum diatur', 
          values: '["Tulis nilai kehidupan pertama Anda", "Tulis nilai kehidupan kedua Anda"]' 
        } 
      });
    }
    
    // Alias values_list ke values agar sesuai dengan Frontend
    res.status(200).json({ 
      success: true, 
      data: { 
        statement: rows[0].statement, 
        values: rows[0].values_list 
      } 
    });
  } catch (error) {
    console.error("Get Vision Error:", error);
    res.status(500).json({ success: false, message: 'Gagal memuat visi' });
  }
};

const updateVision = async (req, res) => {
  const { statement, values } = req.body;
  const userId = req.user.id;
  const dbPromise = db.promise();

  try {
    // Memastikan tabel ada sebelum meng-update
    await dbPromise.query(`
        CREATE TABLE IF NOT EXISTS life_vision (
          user_id INT PRIMARY KEY,
          statement TEXT NOT NULL,
          values_list TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    await dbPromise.query(
      `INSERT INTO life_vision (user_id, statement, values_list) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE statement=?, values_list=?`,
      [userId, statement, values, statement, values]
    );

    await logActivity(userId, 'life_planning', 'update', 'Visi & Misi Diperbarui', 'Pembaruan arah kompas dan masterplan hidup utama.');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update Vision Error:", error);
    res.status(500).json({ success: false, message: 'Gagal mengupdate visi' });
  }
};


// --- 3. HABITS & TRACKER ---
const getHabits = async (req, res) => {
    try {
        const dbPromise = db.promise();
        const [habits] = await dbPromise.query('SELECT * FROM habits WHERE user_id = ?', [req.user.id]);

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
        const [[habit]] = await dbPromise.query('SELECT title FROM habits WHERE id = ?', [habit_id]);

        if (existing.length > 0) {
            await dbPromise.query('DELETE FROM habit_logs WHERE id = ?', [existing[0].id]);
            await logActivity(userId, 'habits', 'delete', 'Habit Batal Diceklis', `Membatalkan ceklis habit: ${habit?.title || 'Unknown'}.`);
            res.status(200).json({ success: true, action: 'removed' });
        } else {
            await dbPromise.query('INSERT INTO habit_logs (user_id, habit_id, log_date) VALUES (?, ?, ?)', [userId, habit_id, log_date]);
            await logActivity(userId, 'habits', 'complete', 'Habit Selesai ✔️', `Menyelesaikan habit: ${habit?.title || 'Unknown'}.`);
            res.status(201).json({ success: true, action: 'added' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses habit log' });
    }
};

const addHabit = async (req, res) => {
    const { title, target_per_week, color } = req.body;
    try {
        await db.promise().query(
            'INSERT INTO habits (user_id, title, target_per_week, color) VALUES (?, ?, ?, ?)',
            [req.user.id, title, target_per_week || 5, color || 'blue']
        );
        await logActivity(req.user.id, 'habits', 'create', 'Habit Baru', `Mulai membangun kebiasaan: ${title}`);
        res.status(201).json({ success: true, message: 'Habit ditambahkan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah Habit' });
    }
};

const updateHabit = async (req, res) => {
    const { title, target_per_week, color } = req.body;
    try {
        await db.promise().query(
            'UPDATE habits SET title = ?, target_per_week = ?, color = ? WHERE id = ? AND user_id = ?',
            [title, target_per_week, color, req.params.id, req.user.id]
        );
        await logActivity(req.user.id, 'habits', 'update', 'Habit Diperbarui', `Mengedit detail kebiasaan: ${title}`);
        res.status(200).json({ success: true, message: 'Habit diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update Habit' });
    }
};

const deleteHabit = async (req, res) => {
    try {
        await db.promise().query('DELETE FROM habits WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        await logActivity(req.user.id, 'habits', 'delete', 'Habit Dihapus', 'Satu kebiasaan telah dihapus dari tracker.');
        res.status(200).json({ success: true, message: 'Habit dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus Habit' });
    }
};

// --- 4. ACHIEVEMENTS ---
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
        await logActivity(req.user.id, 'achievements', 'create', 'Achievement Baru! 🏆', `Menambahkan pencapaian: ${title}.`);
        res.status(201).json({ success: true, message: 'Achievement ditambahkan!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambah Achievement' });
    }
};

const deleteAchievement = async (req, res) => {
    try {
        await db.promise().query('DELETE FROM achievements WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        await logActivity(req.user.id, 'achievements', 'delete', 'Achievement Dihapus', 'Satu rekam jejak pencapaian telah dihapus.');
        res.status(200).json({ success: true, message: 'Achievement dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus Achievement' });
    }
};

module.exports = {
    getLifePlans, updateLifePlan, addLifePlan, deleteLifePlan,
    getVision, updateVision, 
    getHabits, toggleHabitLog, addHabit, updateHabit, deleteHabit,
    getAchievements, addAchievement, deleteAchievement,
};