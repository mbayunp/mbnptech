// backend/controllers/activityController.js
const db = require('../config/db');

// --- FUNGSI PEMBANTU (Digunakan oleh controller lain untuk mencatat log otomatis) ---
const logActivity = async (userId, module, action, title, description, data = null) => {
  try {
    const dataJson = data ? JSON.stringify(data) : null;
    await db.promise().query(
      'INSERT INTO activity_logs (user_id, module, action, title, description, data) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, module, action, title, description, dataJson]
    );
  } catch (error) {
    console.error('Gagal mencatat log aktivitas:', error);
  }
};

// --- ENDPOINT UNTUK HALAMAN ACTIVITY ---
const getActivities = async (req, res) => {
  const userId = req.user.id;
  const { module, action, filterDate } = req.query; // Untuk filter

  try {
    const dbPromise = db.promise();
    
    // 1. Base Query untuk List Activity
    let query = 'SELECT * FROM activity_logs WHERE user_id = ?';
    let params = [userId];

    if (module && module !== 'all') { query += ' AND module = ?'; params.push(module); }
    if (action && action !== 'all') { query += ' AND action = ?'; params.push(action); }
    
    // Filter Waktu Sederhana
    if (filterDate === 'today') { query += ' AND DATE(created_at) = CURRENT_DATE()'; }
    if (filterDate === 'week') { query += ' AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)'; }
    if (filterDate === 'month') { query += ' AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)'; }

    query += ' ORDER BY created_at DESC LIMIT 100'; // Batasi 100 log terakhir
    const [logs] = await dbPromise.query(query, params);

    // 2. Ambil Statistik (Total, Today, Week)
    const [[{ total_all }]] = await dbPromise.query('SELECT COUNT(*) as total_all FROM activity_logs WHERE user_id = ?', [userId]);
    const [[{ total_today }]] = await dbPromise.query('SELECT COUNT(*) as total_today FROM activity_logs WHERE user_id = ? AND DATE(created_at) = CURRENT_DATE()', [userId]);
    const [[{ total_week }]] = await dbPromise.query('SELECT COUNT(*) as total_week FROM activity_logs WHERE user_id = ? AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)', [userId]);

    // 3. Ambil Modul Teraktif & Chart Data
    const [moduleStats] = await dbPromise.query('SELECT module, COUNT(*) as count FROM activity_logs WHERE user_id = ? GROUP BY module ORDER BY count DESC', [userId]);
    const activeModule = moduleStats.length > 0 ? moduleStats[0].module : '-';

    res.status(200).json({
      success: true,
      data: {
        logs,
        stats: { total: total_all, today: total_today, week: total_week, activeModule },
        chartData: moduleStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data aktivitas' });
  }
};

const clearActivities = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM activity_logs WHERE user_id = ?', [req.user.id]);
    res.status(200).json({ success: true, message: 'Riwayat aktivitas dibersihkan!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membersihkan riwayat' });
  }
};

const deleteActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query('DELETE FROM activity_logs WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.status(200).json({ success: true, message: 'Log berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus log' });
  }
};

module.exports = { logActivity, getActivities, clearActivities, deleteActivityLog };