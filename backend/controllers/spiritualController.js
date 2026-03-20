// backend/controllers/spiritualController.js
const db = require('../config/db');
const { logActivity } = require('./activityController');

// 1. GET ALL SPIRITUAL DATA (Hari Ini)
const getSpiritualData = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    
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

    res.status(200).json({
      success: true,
      data: {
        ibadah: ibadah[0] || {},
        amalan: amalan[0] || {},
        quran: quran[0] || { surah: 'Al-Fatihah', ayat: 1, page: 1, juz: 1 },
        doa,
        reflection: reflection[0] || { gratitude: '', mistake: '', improvement: '', mood: '' }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data spiritual' });
  }
};

// 2. TOGGLE IBADAH (Insert jika belum ada, Update jika ada)
const toggleIbadah = async (req, res) => {
  const { field } = req.body; // misal: 'subuh', 'puasa_senin'
  const userId = req.user.id;
  try {
    // Validasi field untuk mencegah SQL Injection
    const validFields = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'dhuha', 'tahajud', 'puasa_senin', 'puasa_kamis'];
    if (!validFields.includes(field)) return res.status(400).json({ success: false });

    await db.promise().query(
      `INSERT INTO ibadah_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE) 
       ON DUPLICATE KEY UPDATE ${field} = NOT ${field}`, 
      [userId]
    );

    await logActivity(userId, 'life_planning', 'update', 'Ibadah Diupdate', `Mengupdate status ibadah: ${field}`);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

// 3. TOGGLE AMALAN
const toggleAmalan = async (req, res) => {
  const { field } = req.body;
  const userId = req.user.id;
  try {
    const validFields = ['dzikir_pagi', 'dzikir_petang', 'istighfar', 'sholawat', 'sedekah'];
    if (!validFields.includes(field)) return res.status(400).json({ success: false });

    await db.promise().query(
      `INSERT INTO amalan_daily (user_id, log_date, ${field}) VALUES (?, CURRENT_DATE(), TRUE) 
       ON DUPLICATE KEY UPDATE ${field} = NOT ${field}`, 
      [userId]
    );
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
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
    await db.promise().query('INSERT INTO doa_pribadi (user_id, title, category, content) VALUES (?, ?, ?, ?)', [req.user.id, title, category, content]);
    res.status(201).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
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

module.exports = { getSpiritualData, toggleIbadah, toggleAmalan, updateQuran, addDoa, deleteDoa, updateReflection };