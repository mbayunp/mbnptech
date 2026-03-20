// backend/controllers/settingsController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { logActivity } = require('./activityController');

// 1. GET ALL SETTINGS (Profile + System + Spiritual)
const getAllSettings = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    
    // Ambil data User & System & Spiritual dalam satu waktu
    const [user] = await dbPromise.query(
      'SELECT name, email, phone, location, bio, photo FROM users WHERE id = ?', [userId]
    );
    const [system] = await dbPromise.query(
      'SELECT theme, language, time_format, default_page FROM system_settings WHERE user_id = ?', [userId]
    );
    const [spiritual] = await dbPromise.query(
      'SELECT quran_target_page, puasa_senin_kamis, doa_after_sholat FROM spiritual_settings WHERE user_id = ?', [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        profile: user[0],
        system: system[0] || { theme: 'light', language: 'id', time_format: '24h', default_page: 'dashboard' },
        spiritual: spiritual[0] || { quran_target_page: 1, puasa_senin_kamis: 1, doa_after_sholat: 1 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat pengaturan' });
  }
};

// 2. UPDATE PROFILE
const updateProfile = async (req, res) => {
  const { name, phone, location, bio } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query(
      'UPDATE users SET name = ?, phone = ?, location = ?, bio = ? WHERE id = ?',
      [name, phone, location, bio, userId]
    );
    
    await logActivity(userId, 'system', 'update', 'Profil Diperbarui', 'Melakukan perubahan pada informasi profil diri.');
    res.status(200).json({ success: true, message: 'Profil berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update profil' });
  }
};

// 3. UPDATE SYSTEM PREFERENCES
const updateSystemSettings = async (req, res) => {
  const { theme, language, time_format, default_page } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query(
      `INSERT INTO system_settings (user_id, theme, language, time_format, default_page) 
       VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
       theme=?, language=?, time_format=?, default_page=?`,
      [userId, theme, language, time_format, default_page, theme, language, time_format, default_page]
    );
    res.status(200).json({ success: true, message: 'Preferensi sistem disimpan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update preferensi' });
  }
};

// 4. UPDATE SPIRITUAL SETTINGS
const updateSpiritualSettings = async (req, res) => {
  const { quran_target_page, puasa_senin_kamis, doa_after_sholat } = req.body;
  const userId = req.user.id;
  try {
    await db.promise().query(
      `INSERT INTO spiritual_settings (user_id, quran_target_page, puasa_senin_kamis, doa_after_sholat) 
       VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
       quran_target_page=?, puasa_senin_kamis=?, doa_after_sholat=?`,
      [userId, quran_target_page, puasa_senin_kamis, doa_after_sholat, quran_target_page, puasa_senin_kamis, doa_after_sholat]
    );
    res.status(200).json({ success: true, message: 'Pengaturan spiritual disimpan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update spiritual settings' });
  }
};

// 5. UPDATE PASSWORD (SECURITY)
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    const [user] = await dbPromise.query('SELECT password FROM users WHERE id = ?', [userId]);

    const isMatch = await bcrypt.compare(oldPassword, user[0].password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Password lama salah' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbPromise.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    await logActivity(userId, 'system', 'update', 'Password Diubah', 'Keamanan akun ditingkatkan dengan ganti password.');

    res.status(200).json({ success: true, message: 'Password berhasil diganti' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal ganti password' });
  }
};

// 6. EXPORT ALL DATA (JSON)
const exportUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const dbPromise = db.promise();
    const [finances] = await dbPromise.query('SELECT * FROM finances WHERE user_id = ?', [userId]);
    const [tasks] = await dbPromise.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    const [habits] = await dbPromise.query('SELECT * FROM habits WHERE user_id = ?', [userId]);
    const [spiritual] = await dbPromise.query('SELECT * FROM ibadah_daily WHERE user_id = ?', [userId]);

    const backupData = {
      export_date: new Date(),
      user_id: userId,
      data: { finances, tasks, habits, spiritual }
    };

    res.status(200).json({ success: true, data: backupData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal export data' });
  }
};

module.exports = { 
  getAllSettings, updateProfile, updateSystemSettings, 
  updateSpiritualSettings, updatePassword, exportUserData 
};