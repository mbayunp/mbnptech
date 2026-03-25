// backend/controllers/spiritualController.js
const db = require('../config/db');
const { logActivity } = require('./activityController');

// 1. GET ALL SPIRITUAL DATA (Hari Ini + Riwayat 7 Hari)
const getSpiritualData = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    
    // Auto-create table doa_pribadi jika belum ada (Bantuan untuk mencegah error 500)
    await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS doa_pribadi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ambil ibadah hari ini
    const [ibadah] = await dbPromise.query('SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]);
    // Ambil amalan hari ini
    const [amalan] = await dbPromise.query('SELECT * FROM amalan_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]);
    // Ambil Quran last read
    const [quran] = await dbPromise.query('SELECT * FROM quran_last_read WHERE user_id = ?', [userId]);
    // Ambil Doa
    const [doa] = await dbPromise.query('SELECT * FROM doa_pribadi WHERE user_id = ? ORDER BY id DESC', [userId]);
    // Ambil Refleksi hari ini
    const [reflection] = await dbPromise.query('SELECT * FROM spiritual_reflections WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]);

    const [historyLogs] = await dbPromise.query(`
      SELECT 
        DATE_FORMAT(i.log_date, '%Y-%m-%d') as log_date,
        i.subuh, i.dzuhur, i.ashar, i.maghrib, i.isya,
        a.dzikir_pagi, a.dzikir_petang, a.istighfar, a.sholawat, a.sedekah
      FROM ibadah_daily i
      LEFT JOIN amalan_daily a ON i.user_id = a.user_id AND i.log_date = a.log_date
      WHERE i.user_id = ? AND i.log_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
      ORDER BY i.log_date ASC
    `, [userId]);

    res.status(200).json({
      success: true,
      data: {
        ibadah: ibadah[0] || {},
        amalan: amalan[0] || {},
        quran: quran[0] || { surah: 'Al-Fatihah', ayat: 1, page: 1, juz: 1 },
        doa: doa || [],
        reflection: reflection[0] || { gratitude: '', mistake: '', improvement: '', mood: '' },
        history: historyLogs 
      }
    });
  } catch (error) {
    console.error("Spiritual Get Data Error:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data spiritual' });
  }
};

// 2. TOGGLE IBADAH (Diperbaiki agar sesuai dengan Frontend)
const toggleIbadah = async (req, res) => {
  // Frontend mengirim nama field (contoh: 'subuh') dan status terbarunya (isDone: true/false)
  // Karena sebelumnya Frontend hanya mengirim { field: 'subuh' }, mari kita handle agar jadi fleksibel.
  const { field } = req.body; 
  const userId = req.user.id;
  try {
    const validFields = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'dhuha', 'tahajud', 'puasa_senin', 'puasa_kamis'];
    if (!validFields.includes(field)) return res.status(400).json({ success: false, message: 'Field tidak valid' });

    const dbPromise = db.promise();
    
    // Cek apakah data ibadah hari ini sudah ada
    const [existing] = await dbPromise.query('SELECT * FROM ibadah_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]);

    if (existing.length === 0) {
      // Jika belum ada record hari ini, buat baru dan set field yang diklik jadi TRUE
      await dbPromise.query(
        `INSERT INTO ibadah_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE)`, 
        [userId]
      );
    } else {
      // Jika sudah ada, balik nilainya (Toggle) berdasarkan nilai di DB
      const currentValue = existing[0][field];
      const newValue = currentValue ? 0 : 1; // Balik nilai: 1 jadi 0, 0 jadi 1
      
      await dbPromise.query(
        `UPDATE ibadah_daily SET ${field} = ? WHERE user_id = ? AND log_date = CURRENT_DATE()`, 
        [newValue, userId]
      );
    }

    await logActivity(userId, 'life_planning', 'update', 'Ibadah Diupdate', `Mengupdate status ibadah: ${field}`);
    res.status(200).json({ success: true });
  } catch (error) { 
    console.error("Toggle Ibadah Error:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan status ibadah' }); 
  }
};

// 3. TOGGLE AMALAN (Sama dengan Ibadah)
const toggleAmalan = async (req, res) => {
  const { field } = req.body;
  const userId = req.user.id;
  try {
    const validFields = ['dzikir_pagi', 'dzikir_petang', 'istighfar', 'sholawat', 'sedekah'];
    if (!validFields.includes(field)) return res.status(400).json({ success: false, message: 'Field tidak valid' });

    const dbPromise = db.promise();
    const [existing] = await dbPromise.query('SELECT * FROM amalan_daily WHERE user_id = ? AND log_date = CURRENT_DATE()', [userId]);

    if (existing.length === 0) {
      await dbPromise.query(`INSERT INTO amalan_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE)`, [userId]);
    } else {
      const newValue = existing[0][field] ? 0 : 1;
      await dbPromise.query(`UPDATE amalan_daily SET ${field} = ? WHERE user_id = ? AND log_date = CURRENT_DATE()`, [newValue, userId]);
    }

    res.status(200).json({ success: true });
  } catch (error) { 
    console.error("Toggle Amalan Error:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan status amalan' }); 
  }
};

// 4. UPDATE QURAN
const updateQuran = async (req, res) => {
  const { surah, ayat, page, juz } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query(
      `INSERT INTO quran_last_read (user_id, surah, ayat, page, juz) VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE surah=?, ayat=?, page=?, juz=?`,
      [userId, surah, ayat, page, juz, surah, ayat, page, juz]
    );
    await logActivity(userId, 'life_planning', 'update', 'Tilawah Quran', `Membaca sampai ${surah} ayat ${ayat}`);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

// 5. DOA & REFLECTION
const addDoa = async (req, res) => {
  const { title, category, content } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO doa_pribadi (user_id, title, category, content) VALUES (?, ?, ?, ?)', 
      [req.user.id, title, category, content]
    );
    res.status(201).json({ success: true, message: 'Doa berhasil ditambahkan' });
  } catch (error) { 
    console.error("Add Doa Error:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan doa' }); 
  }
};

const deleteDoa = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM doa_pribadi WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

const updateReflection = async (req, res) => {
  const { gratitude, mistake, improvement, mood } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query(
      `INSERT INTO spiritual_reflections (user_id, log_date, gratitude, mistake, improvement, mood) VALUES (?, CURRENT_DATE(), ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE gratitude=?, mistake=?, improvement=?, mood=?`,
      [userId, gratitude, mistake, improvement, mood, gratitude, mistake, improvement, mood]
    );
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

// 6. UPDATE HISTORY
const updateHistory = async (req, res) => {
  const { log_date, ibadah, amalan } = req.body;
  const userId = req.user.id;
  
  if (!log_date) return res.status(400).json({ success: false, message: 'Tanggal diperlukan' });

  try {
    const dbPromise = db.promise();
    
    await dbPromise.query(`
      INSERT INTO ibadah_daily (user_id, log_date, subuh, dzuhur, ashar, maghrib, isya) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE subuh=?, dzuhur=?, ashar=?, maghrib=?, isya=?
    `, [
      userId, log_date, 
      ibadah.subuh || false, ibadah.dzuhur || false, ibadah.ashar || false, ibadah.maghrib || false, ibadah.isya || false,
      ibadah.subuh || false, ibadah.dzuhur || false, ibadah.ashar || false, ibadah.maghrib || false, ibadah.isya || false
    ]);

    await dbPromise.query(`
      INSERT INTO amalan_daily (user_id, log_date, dzikir_pagi, dzikir_petang, istighfar, sholawat, sedekah) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE dzikir_pagi=?, dzikir_petang=?, istighfar=?, sholawat=?, sedekah=?
    `, [
      userId, log_date, 
      amalan.dzikir_pagi || false, amalan.dzikir_petang || false, amalan.istighfar || false, amalan.sholawat || false, amalan.sedekah || false,
      amalan.dzikir_pagi || false, amalan.dzikir_petang || false, amalan.istighfar || false, amalan.sholawat || false, amalan.sedekah || false
    ]);

    await logActivity(userId, 'life_planning', 'update', 'Edit Riwayat Spiritual', `Memperbarui riwayat ibadah pada tanggal ${log_date}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui riwayat' });
  }
};

module.exports = { getSpiritualData, toggleIbadah, toggleAmalan, updateQuran, addDoa, deleteDoa, updateReflection, updateHistory };