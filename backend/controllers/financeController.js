// backend/controllers/financeController.js
const db = require('../config/db');
// Import logActivity dari activityController
const { logActivity } = require('./activityController');

const addQuickFinance = async (req, res) => {
  const { date, category, description, amount, type } = req.body;
  
  try {
    let userId;
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      const [users] = await db.promise().query('SELECT id FROM users LIMIT 1');
      if (users.length === 0) {
        return res.status(400).json({ success: false, message: 'Error: Tidak ada user di database. Silakan register dulu!' });
      }
      userId = users[0].id;
    }

    const query = 'INSERT INTO finances (user_id, date, category, description, amount, type) VALUES (?, ?, ?, ?, ?, ?)';
    await db.promise().query(query, [userId, date, category, description || '', amount, type]);
    
    // --- LOG ACTIVITY ---
    const actionType = type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    await logActivity(userId, 'finance', 'create', `${actionType} Baru`, `${actionType} sebesar Rp${amount} dicatat.`, { category, amount, description });

    res.status(201).json({ success: true, message: 'Transaksi berhasil dicatat!' });
  } catch (error) {
    console.error('❌ Database Error Detail:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan ke database' });
  }
};

const getFullFinanceStats = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();

    // A & B (Saldo & Transaksi)
    const [allFinances] = await dbPromise.query('SELECT type, SUM(amount) as total FROM finances WHERE user_id = ? GROUP BY type', [userId]);
    const [monthFinances] = await dbPromise.query('SELECT type, SUM(amount) as total FROM finances WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) GROUP BY type', [userId]);
    
    let totalIncome = 0, totalExpense = 0, monthIncome = 0, monthExpense = 0;
    allFinances.forEach(i => { if(i.type === 'income') totalIncome = Number(i.total); else totalExpense = Number(i.total); });
    monthFinances.forEach(i => { if(i.type === 'income') monthIncome = Number(i.total); else monthExpense = Number(i.total); });
    const balance = totalIncome - totalExpense;

    const [transactions] = await dbPromise.query('SELECT id, date, type, category, amount, description as note FROM finances WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 10', [userId]);

    // C. MULTI-HUTANG: Ambil SEMUA daftar hutang
    const [debts] = await dbPromise.query(
      'SELECT id, name, due_date, total_amount as total_debt, (total_amount - remaining_amount) as total_paid, remaining_amount as remaining_debt FROM debts WHERE user_id = ? ORDER BY id DESC', 
      [userId]
    );
    
    let totalDebtRemaining = 0;
    debts.forEach(d => totalDebtRemaining += Number(d.remaining_debt));

    // D & E (Grafik)
    const [monthlyRaw] = await dbPromise.query(`SELECT DATE_FORMAT(date, '%b') as month, type, SUM(amount) as total FROM finances WHERE user_id = ? AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH) GROUP BY YEAR(date), MONTH(date), DATE_FORMAT(date, '%b'), type ORDER BY YEAR(date) ASC, MONTH(date) ASC`, [userId]);
    const chartMap = {};
    monthlyRaw.forEach(row => {
      if(!chartMap[row.month]) chartMap[row.month] = { name: row.month, Income: 0, Expense: 0 };
      if(row.type === 'income') chartMap[row.month].Income = Number(row.total);
      if(row.type === 'expense') chartMap[row.month].Expense = Number(row.total);
    });
    const barChart = Object.values(chartMap);

    const [pieRaw] = await dbPromise.query(`SELECT category as name, SUM(amount) as value FROM finances WHERE user_id = ? AND type = 'expense' AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) GROUP BY category ORDER BY value DESC`, [userId]);

    res.status(200).json({
      success: true,
      data: {
        summary: { balance, monthIncome, monthExpense },
        debts: debts, 
        totalDebtRemaining, 
        transactions,
        barChart,
        pieChart: pieRaw.map(p => ({ ...p, value: Number(p.value) }))
      }
    });
  } catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

const addDebt = async (req, res) => {
  const { name, totalAmount, dueDate } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO debts (user_id, name, total_amount, remaining_amount, due_date) VALUES (?, ?, ?, ?, ?)', 
      [req.user.id, name, totalAmount, totalAmount, dueDate || null]
    );
    
    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'finance', 'create', 'Hutang Baru Dicatat', `Hutang: ${name}`, { amount: totalAmount });

    res.status(201).json({ success: true, message: 'Hutang ditambahkan!' });
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal menambah hutang' }); }
};

const updateDebt = async (req, res) => {
  const { name, newTotalAmount, dueDate } = req.body;
  try {
    const dbPromise = db.promise();
    const [debts] = await dbPromise.query('SELECT total_amount, remaining_amount FROM debts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    if (debts.length > 0) {
      const alreadyPaid = debts[0].total_amount - debts[0].remaining_amount;
      const newRemaining = newTotalAmount - alreadyPaid;
      await dbPromise.query(
        'UPDATE debts SET name = ?, total_amount = ?, remaining_amount = ?, due_date = ? WHERE id = ?', 
        [name, newTotalAmount, newRemaining, dueDate || null, req.params.id]
      );
      
      // --- LOG ACTIVITY ---
      await logActivity(req.user.id, 'finance', 'update', 'Edit Total Hutang', `Hutang ${name} diperbarui.`, { new_total: newTotalAmount });

      res.status(200).json({ success: true, message: 'Hutang diperbarui!' });
    } else {
      res.status(404).json({ success: false, message: 'Hutang tidak ditemukan' });
    }
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal update hutang' }); }
};

const deleteDebt = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM debts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'finance', 'delete', 'Hutang Dihapus', 'Satu riwayat hutang telah dihapus permanen.');

    res.status(200).json({ success: true, message: 'Hutang dihapus!' });
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal menghapus hutang' }); }
};

const payDebt = async (req, res) => {
  const { debtId, amount } = req.body;
  try {
    await db.promise().query(
      'UPDATE debts SET remaining_amount = remaining_amount - ? WHERE id = ? AND user_id = ?', 
      [amount, debtId, req.user.id]
    );

    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'finance', 'complete', 'Cicilan Dibayar', `Melakukan pembayaran cicilan sebesar Rp${amount}.`, { amount });

    res.status(200).json({ success: true, message: 'Pembayaran berhasil!' });
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal bayar hutang' }); }
};

const deleteTransaction = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM finances WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    
    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'finance', 'delete', 'Transaksi Dihapus', 'Satu baris riwayat transaksi dihapus.');

    res.status(200).json({ success: true, message: 'Transaksi dihapus!' });
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal menghapus transaksi' }); }
};

const updateTransaction = async (req, res) => {
  const { type, amount, category, date, description } = req.body;
  try {
    await db.promise().query(
      'UPDATE finances SET type = ?, amount = ?, category = ?, date = ?, description = ? WHERE id = ? AND user_id = ?', 
      [type, amount, category, date, description, req.params.id, req.user.id]
    );

    // --- LOG ACTIVITY ---
    await logActivity(req.user.id, 'finance', 'update', 'Transaksi Diedit', `Perubahan data transaksi pada kategori ${category}.`);

    res.status(200).json({ success: true, message: 'Transaksi diperbarui!' });
  } catch (error) { res.status(500).json({ success: false, message: 'Gagal update transaksi' }); }
};

module.exports = { 
  addQuickFinance, 
  getFullFinanceStats, 
  addDebt, 
  updateDebt, 
  deleteDebt, 
  payDebt, 
  deleteTransaction, 
  updateTransaction 
};