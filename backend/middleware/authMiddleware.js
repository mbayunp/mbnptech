// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Cek apakah ada header Authorization yang berawalan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token saja (menghilangkan kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token menggunakan Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Masukkan data user dari token ke dalam request (req.user)
      req.user = decoded;
      next(); // Lanjut ke proses controller
    } catch (error) {
      res.status(401).json({ success: false, message: 'Token tidak valid, akses ditolak!' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Tidak ada token, akses ditolak!' });
  }
};

module.exports = { protect };