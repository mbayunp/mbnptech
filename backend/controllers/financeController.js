// backend/controllers/financeController.js
const db = require('../config/db');

const addQuickFinance = async (req, res) => {
  const { date, category, description, amount, type } = req.body;
  
  try {
    let userId;
    
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      const [users] = await db.promise().query('SELECT id FROM users LIMIT 1');
      
      if (users.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Error: Tidak ada user di database. Silakan register dulu!' 
        });
      }
      
      userId = users[0].id;
    }

    const query = 'INSERT INTO finances (user_id, date, category, description, amount, type) VALUES (?, ?, ?, ?, ?, ?)';
    await db.promise().query(query, [userId, date, category, description || '', amount, type]);
    
    res.status(201).json({ success: true, message: 'Transaksi berhasil dicatat!' });
  } catch (error) {
    console.error('❌ Database Error Detail:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan ke database' });
  }
};

// 2. Tambah Pembayaran Hutang
const payDebt = async (req, res) => {
  const { amount, date } = req.body;
  const userId = req.user.id;

  try {
    const dbPromise = db.promise();
    // Cari hutang yang masih ada sisanya
    const [debts] = await dbPromise.query('SELECT id, remaining_amount FROM debts WHERE user_id = ? AND remaining_amount > 0 LIMIT 1', [userId]);
    
    if (debts.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada hutang tersisa yang perlu dibayar.' });
    }

    const debtId = debts[0].id;

    // Masukkan ke riwayat pembayaran
    await dbPromise.query('INSERT INTO debt_payments (debt_id, amount, payment_date) VALUES (?, ?, ?)', [debtId, amount, date]);
    
    // Kurangi sisa hutang
    await dbPromise.query('UPDATE debts SET remaining_amount = remaining_amount - ? WHERE id = ?', [amount, debtId]);

    res.status(200).json({ success: true, message: 'Pembayaran hutang berhasil dicatat!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat mencatat hutang' });
  }
};

// 3. Ambil Semua Data Keuangan Sekaligus
const getFullFinanceStats = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const dbPromise = db.promise();

    // A. Saldo & Ringkasan Bulan Ini
    const [allFinances] = await dbPromise.query('SELECT type, SUM(amount) as total FROM finances WHERE user_id = ? GROUP BY type', [userId]);
    const [monthFinances] = await dbPromise.query('SELECT type, SUM(amount) as total FROM finances WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) GROUP BY type', [userId]);
    
    let totalIncome = 0, totalExpense = 0, monthIncome = 0, monthExpense = 0;
    allFinances.forEach(i => { if(i.type === 'income') totalIncome = Number(i.total); else totalExpense = Number(i.total); });
    monthFinances.forEach(i => { if(i.type === 'income') monthIncome = Number(i.total); else monthExpense = Number(i.total); });
    const balance = totalIncome - totalExpense;

    // B. Data Tabel: 10 Transaksi Terakhir
    const [transactions] = await dbPromise.query('SELECT id, date, type, category, amount, description as note FROM finances WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 10', [userId]);

    // C. Hutang
    const [debtStats] = await dbPromise.query('SELECT COALESCE(SUM(total_amount), 0) as total_debt, COALESCE(SUM(total_amount - remaining_amount), 0) as total_paid, COALESCE(SUM(remaining_amount), 0) as remaining_debt FROM debts WHERE user_id = ?', [userId]);

    // D. Grafik Bar & Tabel Bulanan (6 Bulan Terakhir)
    const [monthlyRaw] = await dbPromise.query(`
      SELECT DATE_FORMAT(date, '%b') as month, type, SUM(amount) as total 
      FROM finances 
      WHERE user_id = ? AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
      GROUP BY YEAR(date), MONTH(date), DATE_FORMAT(date, '%b'), type
      ORDER BY YEAR(date) ASC, MONTH(date) ASC
    `, [userId]);

    const chartMap = {};
    monthlyRaw.forEach(row => {
      if(!chartMap[row.month]) chartMap[row.month] = { name: row.month, Income: 0, Expense: 0 };
      if(row.type === 'income') chartMap[row.month].Income = Number(row.total);
      if(row.type === 'expense') chartMap[row.month].Expense = Number(row.total);
    });
    const barChart = Object.values(chartMap);

    // E. Grafik Pie: Pengeluaran Berdasarkan Kategori Bulan Ini
    const [pieRaw] = await dbPromise.query(`
      SELECT category as name, SUM(amount) as value 
      FROM finances 
      WHERE user_id = ? AND type = 'expense' AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())
      GROUP BY category ORDER BY value DESC
    `, [userId]);

    res.status(200).json({
      success: true,
      data: {
        summary: { balance, monthIncome, monthExpense },
        debt: debtStats[0] || { total_debt: 0, total_paid: 0, remaining_debt: 0 },
        transactions,
        barChart,
        pieChart: pieRaw.map(p => ({ ...p, value: Number(p.value) }))
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { addQuickFinance, payDebt, getFullFinanceStats };