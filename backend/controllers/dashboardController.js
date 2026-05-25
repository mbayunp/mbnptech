// backend/controllers/dashboardController.js
const db = require('../config/db');

const getDashboardSummary = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();

    // 1. Finance Summary & Debt
    const [finances] = await dbPromise.query(
      'SELECT type, SUM(amount) as total FROM finances WHERE user_id = ? GROUP BY type', [userId]
    );
    const [[{ total_debt }]] = await dbPromise.query(
      'SELECT SUM(remaining_amount) as total_debt FROM debts WHERE user_id = ?', [userId]
    );

    // 2. Todo & Habits Today
    const [[{ todo_count }]] = await dbPromise.query(
      'SELECT COUNT(*) as todo_count FROM tasks WHERE user_id = ? AND status != "done"', [userId]
    );
    const [[{ total_habits }]] = await dbPromise.query(
      'SELECT COUNT(*) as total_habits FROM habits WHERE user_id = ?', [userId]
    );
    const [[{ completed_habits }]] = await dbPromise.query(
      'SELECT COUNT(*) as completed_habits FROM habit_logs WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]
    );

    // 3. Spiritual Today
    const [ibadah] = await dbPromise.query(
      'SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]
    );

    // 4. Inquiries & Activity
    const [[{ unread_inquiry }]] = await dbPromise.query(
      'SELECT COUNT(*) as unread_inquiry FROM inquiries WHERE status = "New"', []
    );
    const [recentLogs] = await dbPromise.query(
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]
    );

    // 5. Finance Chart (6 Bulan Terakhir)
    const [chartData] = await dbPromise.query(
      `SELECT DATE_FORMAT(date, '%b') as name, 
       SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as Income,
       SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as Expense
       FROM finances WHERE user_id = ? AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY YEAR(date), MONTH(date), name ORDER BY YEAR(date) ASC, MONTH(date) ASC`, [userId]
    );

    // 6. Life Planning (Target Utama yang sedang berjalan)
    const [nextGoal] = await dbPromise.query(
      'SELECT title, progress FROM life_plans WHERE user_id = ? AND status = "current" LIMIT 1', [userId]
    );

    // 7. Latest Achievement
    const [lastAchievement] = await dbPromise.query(
      'SELECT title FROM achievements WHERE user_id = ? ORDER BY achieved_year DESC, id DESC LIMIT 1', [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        finance: {
          balance: (finances.find(f => f.type === 'income')?.total || 0) - (finances.find(f => f.type === 'expense')?.total || 0),
          expense: finances.find(f => f.type === 'expense')?.total || 0,
          debt: total_debt || 0
        },
        productivity: {
          pending_tasks: todo_count,
          habits_status: `${completed_habits} / ${total_habits}`
        },
        spiritual: ibadah[0] || {},
        unread_inquiry,
        recentLogs,
        chartData,
        life_goal: nextGoal[0] || { title: "Belum ada target aktif", progress: 0 },
        latest_achievement: lastAchievement[0]?.title || "Belum ada pencapaian"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardHeatmap = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();

    // 1. Activity Logs Heatmap (last 1 year)
    const [activityLogs] = await dbPromise.query(
      `SELECT DATE(created_at) as log_date, COUNT(*) as count 
       FROM activity_logs 
       WHERE user_id = ? AND created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR) 
       GROUP BY DATE(created_at)`,
      [userId]
    );

    // 2. Habits Logs Heatmap (last 1 year)
    const [habitLogs] = await dbPromise.query(
      `SELECT DATE_FORMAT(log_date, '%Y-%m-%d') as log_date, COUNT(*) as count 
       FROM habit_logs 
       WHERE user_id = ? AND log_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR) 
       GROUP BY log_date`,
      [userId]
    );

    // 3. Spiritual Logs Heatmap (last 1 year)
    const [spiritualLogs] = await dbPromise.query(
      `SELECT 
         DATE_FORMAT(i.log_date, '%Y-%m-%d') as log_date,
         (COALESCE(i.subuh, 0) + COALESCE(i.dzuhur, 0) + COALESCE(i.ashar, 0) + COALESCE(i.maghrib, 0) + COALESCE(i.isya, 0) + COALESCE(i.dhuha, 0) + COALESCE(i.tahajud, 0) + COALESCE(i.puasa_senin, 0) + COALESCE(i.puasa_kamis, 0) +
          COALESCE(a.dzikir_pagi, 0) + COALESCE(a.dzikir_petang, 0) + COALESCE(a.istighfar, 0) + COALESCE(a.sholawat, 0) + COALESCE(a.sedekah, 0)) as count
       FROM ibadah_daily i
       LEFT JOIN amalan_daily a ON i.user_id = a.user_id AND i.log_date = a.log_date
       WHERE i.user_id = ? AND i.log_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
       ORDER BY i.log_date ASC`,
      [userId]
    );

    // Format output helper
    const formatLogs = (logs) => {
      return logs.map(row => {
        let dateStr = row.log_date;
        if (dateStr instanceof Date) {
          const localDate = new Date(dateStr.getTime() - (dateStr.getTimezoneOffset() * 60000));
          dateStr = localDate.toISOString().split('T')[0];
        }
        return {
          date: dateStr,
          count: Number(row.count || 0)
        };
      });
    };

    res.status(200).json({
      success: true,
      data: {
        activity: formatLogs(activityLogs),
        habits: formatLogs(habitLogs),
        spiritual: formatLogs(spiritualLogs)
      }
    });
  } catch (error) {
    console.error("Heatmap Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardSummary, getDashboardHeatmap };