const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require('../config/db');

// Inisialisasi Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askJarvis = async (req, res) => {
    const { question } = req.body;
    const userId = req.user.id;

    try {
        const dbPromise = db.promise();
        let contextData = "";

        // Query database secara paralel untuk mendapatkan informasi real-time user
        const [
            [userRows],
            [balanceRows],
            [monthlyIncomeRows],
            [monthlyExpenseRows],
            [debtRows],
            [topExpenseRows],
            [weddingBudgetRows],
            [weddingContributionRows],
            [weddingTimelineRows],
            [habitRows],
            [habitLogsTodayRows],
            [quranRows],
            [prayerRows]
        ] = await Promise.all([
            dbPromise.query('SELECT name FROM users WHERE id = ?', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) AS balance FROM finances WHERE user_id = ?', [userId]).catch(() => [[{ balance: 0 }]]),
            dbPromise.query('SELECT SUM(amount) AS monthly_income FROM finances WHERE user_id = ? AND type = "income" AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())', [userId]).catch(() => [[{ monthly_income: 0 }]]),
            dbPromise.query('SELECT SUM(amount) AS monthly_expense FROM finances WHERE user_id = ? AND type = "expense" AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())', [userId]).catch(() => [[{ monthly_expense: 0 }]]),
            dbPromise.query('SELECT SUM(remaining_amount) AS total_debt FROM debts WHERE user_id = ?', [userId]).catch(() => [[{ total_debt: 0 }]]),
            dbPromise.query('SELECT category, SUM(amount) AS total FROM finances WHERE user_id = ? AND type = "expense" AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) GROUP BY category ORDER BY total DESC LIMIT 1', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT category, budget, actual FROM wedding_budgets WHERE user_id = ?', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT name, amount FROM wedding_contributions WHERE user_id = ?', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT task, status FROM wedding_timeline WHERE user_id = ?', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT COUNT(*) AS total FROM habits WHERE user_id = ?', [userId]).catch(() => [[{ total: 0 }]]),
            dbPromise.query('SELECT COUNT(*) AS completed FROM habit_logs WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]).catch(() => [[{ completed: 0 }]]),
            dbPromise.query('SELECT surah, ayat, page, juz FROM quran_last_read WHERE user_id = ?', [userId]).catch(() => [[]]),
            dbPromise.query('SELECT subuh, dzuhur, ashar, maghrib, isya, dhuha, tahajud FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]).catch(() => [[]])
        ]);

        const name = userRows?.[0]?.name || "A Bayu";
        const balance = balanceRows?.[0]?.balance || 0;
        const monthlyIncome = monthlyIncomeRows?.[0]?.monthly_income || 0;
        const monthlyExpense = monthlyExpenseRows?.[0]?.monthly_expense || 0;
        const totalDebt = debtRows?.[0]?.total_debt || 0;
        const topExpenseCat = topExpenseRows?.[0]?.category || "Belum ada";
        const topExpenseAmt = topExpenseRows?.[0]?.total || 0;

        // Wedding calculations
        const budgets = weddingBudgetRows || [];
        const contributions = weddingContributionRows || [];
        const timeline = weddingTimelineRows || [];
        const totalWeddingContribution = contributions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const totalWeddingExpense = budgets.reduce((sum, item) => sum + Number(item.actual || 0), 0);
        const totalWeddingBudget = budgets.reduce((sum, item) => sum + Number(item.budget || 0), 0);
        const weddingBalance = totalWeddingContribution - totalWeddingExpense;

        // Habits calculations
        const habitsTotalCount = habitRows?.[0]?.total || 0;
        const habitsCompletedToday = habitLogsTodayRows?.[0]?.completed || 0;
        const habitCompletionRate = habitsTotalCount > 0 ? Math.round((habitsCompletedToday / habitsTotalCount) * 100) : 0;

        // Spiritual calculations
        const quran = quranRows?.[0] || null;
        const prayers = prayerRows?.[0] || null;
        const completedPrayers = prayers ? ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'dhuha', 'tahajud'].filter(p => prayers[p] === 1) : [];

        contextData = `
        [KONTEKS UTAMA USER (${name})]
        
        1. FINANCIAL STATE:
        - Saldo Aktif Saat Ini: Rp ${Number(balance).toLocaleString('id-ID')}
        - Pemasukan Bulan Ini: Rp ${Number(monthlyIncome).toLocaleString('id-ID')}
        - Pengeluaran Bulan Ini: Rp ${Number(monthlyExpense).toLocaleString('id-ID')}
        - Total Hutang Belum Lunas: Rp ${Number(totalDebt).toLocaleString('id-ID')}
        - Kategori Pengeluaran Terbesar Bulan Ini: ${topExpenseCat} (Rp ${Number(topExpenseAmt).toLocaleString('id-ID')})

        2. WEDDING PLANNER STATE:
        - Sisa Saldo Pernikahan (Uang Riil): Rp ${Number(weddingBalance).toLocaleString('id-ID')}
        - Total Dana Masuk (Kontribusi): Rp ${Number(totalWeddingContribution).toLocaleString('id-ID')}
        - Total Terpakai Pernikahan: Rp ${Number(totalWeddingExpense).toLocaleString('id-ID')}
        - Total Rencana Anggaran (Budget): Rp ${Number(totalWeddingBudget).toLocaleString('id-ID')}
        - Sisa Anggaran Belum Terpakai: Rp ${Number(totalWeddingBudget - totalWeddingExpense).toLocaleString('id-ID')}
        - Kebutuhan Budget Detail: ${JSON.stringify(budgets)}
        - Agenda Timeline Nikah: ${JSON.stringify(timeline)}

        3. PRODUCTIVITY & HABITS STATE:
        - Total Kebiasaan Aktif: ${habitsTotalCount} habit
        - Kebiasaan Selesai Hari Ini: ${habitsCompletedToday} habit (${habitCompletionRate}% completion rate)

        4. SPIRITUAL STATE:
        - Terakhir Baca Quran: ${quran ? `Surah ${quran.surah} Ayat ${quran.ayat} (Halaman ${quran.page}, Juz ${quran.juz})` : 'Belum mencatat tilawah'}
        - Ibadah Dilaporkan Hari Ini: ${completedPrayers.length > 0 ? completedPrayers.join(', ') : 'Belum mencatat ibadah wajib/sunnah'}
        `;

        // ==============================================================
        // 3. SYSTEM INSTRUCTIONS (Instruksi Otak Jarvis)
        // ==============================================================
        const systemPrompt = `
            Kamu adalah Jarvis, asisten AI eksklusif yang tertanam di MBNP Tech System.
            Gaya bahasamu cerdas, ringkas, futuristik ala film sci-fi (Iron Man), dan bersahabat (selalu panggil user dengan 'A Bayu').
            
            Konteks Real-Time User Saat Ini:
            ${contextData}

            Instruksi Penting:
            1. Bedakan dengan tegas antara "Budget Pernikahan" (alokasi rencana) dan "Saldo Pernikahan/Saldo Pribadi" (uang riil).
            2. Jangan pernah sebutkan kata "database", "MySQL", "query", atau format data "JSON". Berbicaralah layaknya asisten pintar yang langsung mengetahui kondisi A Bayu secara alami.
            3. Jawablah secara cerdas, taktis, dan padat. Utamakan memberikan angka dan status yang valid berdasarkan data di atas jika A Bayu bertanya tentang uang, habit, tilawah, atau persiapan nikah.
            4. Tawarkan rekomendasi jika kondisi keuangan kurang aman (misalnya pengeluaran tinggi atau ada cicilan hutang).
        `;

        // ==============================================================
        // 4. GENERATE RESPONSE
        // ==============================================================
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const fullPrompt = `${systemPrompt}\n\nPertanyaan User: ${question}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();

        // 5. KIRIM BALASAN KE FRONTEND
        res.status(200).json({ success: true, answer: response });

    } catch (error) {
        console.error("Jarvis Error:", error);
        res.status(500).json({ success: false, message: 'Koneksi satelit sedang terganggu, A Bayu. Silakan coba beberapa detik lagi.' });
    }
};

module.exports = { askJarvis }; 