// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Import logActivity
const { logActivity } = require('./activityController');

// --- REGISTER ---
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(query, [name, email, hashedPassword]);

    await logActivity(result.insertId, 'system', 'create', 'Akun Dibuat', `Pendaftaran akun berhasil untuk email: ${email}.`);

    res.status(201).json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    console.error('Error Register:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Email tidak ditemukan!' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password salah!' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // --- LOG ACTIVITY UNTUK LOGIN ---
    await logActivity(user.id, 'system', 'login', 'Login Berhasil', `User ${user.name} masuk ke dalam dashboard admin.`);

    res.status(200).json({ 
      success: true, 
      message: 'Login berhasil!',
      token: token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error Login:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { register, login };