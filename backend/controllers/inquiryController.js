// backend/controllers/inquiryController.js
const db = require('../config/db');
const { logActivity } = require('./activityController');

// 1. GET ALL INQUIRIES (Untuk Admin)
const getInquiries = async (req, res) => {
  try {
    const [inquiries] = await db.promise().query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data inquiry' });
  }
};

// 2. UPDATE STATUS INQUIRY
const updateInquiryStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    // Ambil nama klien untuk log
    const [[inquiry]] = await db.promise().query('SELECT name FROM inquiries WHERE id = ?', [id]);
    
    await db.promise().query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    
    // LOG ACTIVITY (Wajib login)
    if(req.user) {
      await logActivity(req.user.id, 'system', 'update', 'Status Lead Diubah', `Status inquiry dari ${inquiry?.name} diubah menjadi ${status}`);
    }

    res.status(200).json({ success: true, message: 'Status berhasil diubah!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengubah status' });
  }
};

// 3. DELETE INQUIRY
const deleteInquiry = async (req, res) => {
  try {
    await db.promise().query('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    
    if(req.user) {
      await logActivity(req.user.id, 'system', 'delete', 'Lead Dihapus', 'Satu pesan inquiry telah dihapus dari sistem.');
    }

    res.status(200).json({ success: true, message: 'Inquiry dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus inquiry' });
  }
};

// 4. ADD INQUIRY (Dari Frontend Public - Tidak perlu token auth)
const addInquiry = async (req, res) => {
  const { name, email, phone, service, budget, message } = req.body;
  try {
    await db.promise().query(
      'INSERT INTO inquiries (name, email, phone, service, budget, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, service, budget, message]
    );
    res.status(201).json({ success: true, message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengirim pesan' });
  }
};

module.exports = { getInquiries, updateInquiryStatus, deleteInquiry, addInquiry };