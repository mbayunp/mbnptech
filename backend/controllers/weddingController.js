// backend/controllers/weddingController.js
const db = require('../config/db');
const { logActivity } = require('./activityController');

// ==========================================
// 1. GET ALL DATA (Summary & Tabs)
// ==========================================
const getWeddingData = async (req, res) => {
    const userId = req.user.id;
    try {
        const dbPromise = db.promise();

        // Mengambil semua data dari 5 tabel secara paralel
        const [budgets] = await dbPromise.query('SELECT * FROM wedding_budgets WHERE user_id = ? ORDER BY id DESC', [userId]);
        const [expenses] = await dbPromise.query('SELECT e.*, b.category as budget_category FROM wedding_expenses e LEFT JOIN wedding_budgets b ON e.budget_id = b.id WHERE e.user_id = ? ORDER BY e.log_date DESC', [userId]);
        const [contributions] = await dbPromise.query('SELECT * FROM wedding_contributions WHERE user_id = ? ORDER BY id DESC', [userId]);
        const [vendors] = await dbPromise.query('SELECT * FROM wedding_vendors WHERE user_id = ? ORDER BY id DESC', [userId]);
        const [timeline] = await dbPromise.query('SELECT * FROM wedding_timeline WHERE user_id = ? ORDER BY due_date ASC', [userId]);

        // Kalkulasi Total untuk Summary
        const totalBudget = budgets.reduce((acc, curr) => acc + Number(curr.budget), 0);
        const totalUsed = budgets.reduce((acc, curr) => acc + Number(curr.actual), 0);
        const totalIncome = contributions.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Kalkulasi Progress (Maksimal 100%)
        const progress = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalBudget,
                    totalUsed,
                    totalIncome,
                    progress: Math.min(progress, 100)
                },
                budgets,
                expenses,
                contributions,
                vendors,
                timeline
            }
        });
    } catch (error) {
        console.error("Wedding Get Data Error:", error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data wedding' });
    }
};

// ==========================================
// 2. BUDGET PLANNING
// ==========================================
const addBudget = async (req, res) => {
    const { category, budget } = req.body;
    const userId = req.user.id;
    try {
        await db.promise().query(
            'INSERT INTO wedding_budgets (user_id, category, budget) VALUES (?, ?, ?)',
            [userId, category, budget]
        );
        await logActivity(userId, 'wedding', 'create', 'Budget Ditambahkan', `Kategori: ${category}, Rp ${Number(budget).toLocaleString('id-ID')}`);
        res.status(201).json({ success: true, message: 'Budget berhasil ditambahkan' });
    } catch (error) {
        console.error("Add Budget Error:", error);
        res.status(500).json({ success: false, message: 'Gagal menambah budget' });
    }
};

const deleteBudget = async (req, res) => {
    const userId = req.user.id;
    const budgetId = req.params.id;
    try {
        await db.promise().query('DELETE FROM wedding_budgets WHERE id = ? AND user_id = ?', [budgetId, userId]);
        await logActivity(userId, 'wedding', 'delete', 'Budget Dihapus', 'Menghapus satu kategori budget pernikahan');
        res.status(200).json({ success: true, message: 'Budget dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus budget' });
    }
};

// ==========================================
// 3. EXPENSES (Pengeluaran)
// ==========================================
const addExpense = async (req, res) => {
    const { budget_id, vendor, amount, log_date, notes } = req.body;
    const userId = req.user.id;
    try {
        const dbPromise = db.promise();

        // 1. Catat pengeluarannya
        await dbPromise.query(
            'INSERT INTO wedding_expenses (user_id, budget_id, vendor, amount, log_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, budget_id, vendor, amount, log_date, notes]
        );

        // 2. Update kolom 'actual' di tabel wedding_budgets secara otomatis
        await dbPromise.query(
            'UPDATE wedding_budgets SET actual = actual + ? WHERE id = ? AND user_id = ?',
            [amount, budget_id, userId]
        );

        await logActivity(userId, 'wedding', 'create', 'Pengeluaran Dicatat', `Membayar Rp ${Number(amount).toLocaleString('id-ID')} untuk vendor/kebutuhan wedding`);
        res.status(201).json({ success: true, message: 'Pengeluaran dicatat' });
    } catch (error) {
        console.error("Add Expense Error:", error);
        res.status(500).json({ success: false, message: 'Gagal mencatat pengeluaran' });
    }
};

// ==========================================
// 4. CONTRIBUTIONS (Pemasukan / Uang Masuk)
// ==========================================
const addContribution = async (req, res) => {
    const { name, type, amount } = req.body;
    const userId = req.user.id;
    try {
        await db.promise().query(
            'INSERT INTO wedding_contributions (user_id, name, type, amount) VALUES (?, ?, ?, ?)',
            [userId, name, type, amount]
        );
        await logActivity(userId, 'wedding', 'create', 'Dana Masuk', `Menerima Rp ${Number(amount).toLocaleString('id-ID')} dari ${name}`);
        res.status(201).json({ success: true, message: 'Kontribusi berhasil dicatat' });
    } catch (error) {
        console.error("Add Contribution Error:", error);
        res.status(500).json({ success: false, message: 'Gagal mencatat kontribusi' });
    }
};

// FITUR BARU: UPDATE KONTRIBUSI
const updateContribution = async (req, res) => {
    const { name, type, amount } = req.body;
    const userId = req.user.id;
    const contributionId = req.params.id;
    try {
        await db.promise().query(
            'UPDATE wedding_contributions SET name = ?, type = ?, amount = ? WHERE id = ? AND user_id = ?',
            [name, type, amount, contributionId, userId]
        );
        await logActivity(userId, 'wedding', 'update', 'Dana Masuk Diperbarui', `Memperbarui data nominal/nama dari ${name}`);
        res.status(200).json({ success: true, message: 'Kontribusi diperbarui' });
    } catch (error) {
        console.error("Update Contribution Error:", error);
        res.status(500).json({ success: false, message: 'Gagal update kontribusi' });
    }
};

// FITUR BARU: DELETE KONTRIBUSI
const deleteContribution = async (req, res) => {
    const userId = req.user.id;
    const contributionId = req.params.id;
    try {
        await db.promise().query('DELETE FROM wedding_contributions WHERE id = ? AND user_id = ?', [contributionId, userId]);
        await logActivity(userId, 'wedding', 'delete', 'Dana Masuk Dihapus', 'Menghapus satu catatan pemasukan');
        res.status(200).json({ success: true, message: 'Kontribusi dihapus' });
    } catch (error) {
        console.error("Delete Contribution Error:", error);
        res.status(500).json({ success: false, message: 'Gagal menghapus kontribusi' });
    }
};

// ==========================================
// 5. VENDORS
// ==========================================
const addVendor = async (req, res) => {
    const { name, category, contact, price, status } = req.body;
    const userId = req.user.id;
    try {
        await db.promise().query(
            'INSERT INTO wedding_vendors (user_id, name, category, contact, price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, category, contact, price, status]
        );
        await logActivity(userId, 'wedding', 'create', 'Vendor Ditambahkan', `Menambahkan vendor ${name} (${category})`);
        res.status(201).json({ success: true, message: 'Vendor berhasil ditambahkan' });
    } catch (error) {
        console.error("Add Vendor Error:", error);
        res.status(500).json({ success: false, message: 'Gagal menambah vendor' });
    }
};

const updateVendorStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await db.promise().query('UPDATE wedding_vendors SET status = ? WHERE id = ? AND user_id = ?', [status, req.params.id, req.user.id]);
        res.status(200).json({ success: true, message: 'Status vendor diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update status vendor' });
    }
};

// ==========================================
// 6. TIMELINE (Agenda Persiapan)
// ==========================================
const addTimelineTask = async (req, res) => {
    const { task, due_date } = req.body;
    const userId = req.user.id;
    try {
        await db.promise().query(
            'INSERT INTO wedding_timeline (user_id, task, due_date) VALUES (?, ?, ?)',
            [userId, task, due_date]
        );
        await logActivity(userId, 'wedding', 'create', 'Agenda Ditambahkan', `Menambahkan task: ${task}`);
        res.status(201).json({ success: true, message: 'Agenda berhasil ditambahkan' });
    } catch (error) {
        console.error("Add Timeline Error:", error);
        res.status(500).json({ success: false, message: 'Gagal menambah agenda' });
    }
};

// Pastikan semua fungsi diekspor
module.exports = {
    getWeddingData,
    addBudget,
    deleteBudget,
    addExpense,
    addContribution,
    updateContribution,
    deleteContribution,
    addVendor,
    updateVendorStatus,
    addTimelineTask
};