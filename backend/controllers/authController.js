// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER ---
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Cek apakah email sudah terdaftar
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    // 2. Hash Password (Enkripsi)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(query, [name, email, hashedPassword]);

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
    // 1. Cari user berdasarkan email
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Email tidak ditemukan!' });
    }

    const user = users[0];

    // 2. Cocokkan password yang diinput dengan password di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password salah!' });
    }

    // 3. Buat JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    // 4. Kirim token ke frontend
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