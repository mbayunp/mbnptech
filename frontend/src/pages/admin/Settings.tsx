// src/pages/admin/Settings.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { 
  FaUser, FaLock, FaCog, FaBell, FaMosque, 
  FaWallet, FaDatabase, FaShieldAlt, FaSave, FaSignOutAlt, FaDownload, FaTrashAlt
} from 'react-icons/fa';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // States sesuai struktur Backend
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', location: '', bio: ''
  });

  const [system, setSystem] = useState({
    theme: 'light', language: 'id', time_format: '24h', default_page: 'dashboard'
  });

  const [spiritual, setSpiritual] = useState({
    quran_target_page: 1, puasa_senin_kamis: 1, doa_after_sholat: 1
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  // --- 1. FETCH DATA DARI BACKEND ---
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (result.success) {
        setProfile(result.data.profile);
        setSystem(result.data.system);
        setSpiritual(result.data.spiritual);
      }
    } catch (err) {
      console.error("Gagal mengambil data settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // --- 2. HANDLERS UNTUK UPDATE ---
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (res.ok) showSuccessToast('Profil berhasil diperbarui');
    } catch (err) { showErrorAlert(); }
  };

  const handleUpdateSystem = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings/system`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(system)
      });
      if (res.ok) showSuccessToast('Preferensi sistem disimpan');
    } catch (err) { showErrorAlert(); }
  };

  const handleUpdateSpiritual = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings/spiritual`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(spiritual)
      });
      if (res.ok) showSuccessToast('Pengaturan spiritual disimpan');
    } catch (err) { showErrorAlert(); }
  };

  const handleUpdatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error');
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings/security/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccessToast('Password berhasil diganti');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        Swal.fire('Gagal', data.message, 'error');
      }
    } catch (err) { showErrorAlert(); }
  };

  const handleExportData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        // Download sebagai file JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `mbnp_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    } catch (err) { showErrorAlert(); }
  };

  // --- HELPERS ---
  const showSuccessToast = (msg: string) => {
    Swal.fire({ icon: 'success', title: msg, toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
  };
  const showErrorAlert = () => Swal.fire('Error', 'Terjadi kesalahan pada server', 'error');

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: <FaUser /> },
    { id: 'account', name: 'Account & Security', icon: <FaShieldAlt /> },
    { id: 'preferences', name: 'System Preferences', icon: <FaCog /> },
    { id: 'spiritual', name: 'Spiritual Settings', icon: <FaMosque /> },
    { id: 'backup', name: 'Data & Backup', icon: <FaDatabase /> },
  ];

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20 selection:bg-blue-200 selection:text-blue-900">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <FaCog className="text-slate-600" /> Settings & Preferences
        </h2>
        <p className="text-slate-500 mt-1 text-sm font-medium">Kendalikan pengalaman dan personalisasi sistem dashboard Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-2 sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all text-left ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-3">
          
          {/* 1. PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in-down">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Profile Settings</h3>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg">
                    {profile.name?.charAt(0)}
                  </div>
                  <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">Ubah Foto</button>
                </div>
                
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
                      <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nomor WhatsApp</label>
                      <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lokasi / Domisili</label>
                    <input type="text" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bio Singkat</label>
                    <textarea value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button onClick={handleUpdateProfile} className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                  <FaSave /> Simpan Profil
                </button>
              </div>
            </div>
          )}

          {/* 2. ACCOUNT & SECURITY */}
          {activeTab === 'account' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in-down">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Account & Security</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Login</label>
                  <input type="email" value={profile.email} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">*Email tidak dapat diubah karena merupakan identitas utama akun.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password Lama</label>
                    <input type="password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password Baru</label>
                      <input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Konfirmasi Password Baru</label>
                      <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleUpdatePassword} className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg">
                  <FaShieldAlt /> Ganti Password
                </button>
              </div>
            </div>
          )}

          {/* 3. SYSTEM PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in-down">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tema Dashboard</label>
                  <div className="flex gap-3">
                    <button onClick={() => setSystem({...system, theme: 'light'})} className={`flex-1 py-3 border rounded-xl font-bold text-sm transition-all ${system.theme === 'light' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-500 hover:border-slate-300'}`}>Light Mode</button>
                    <button onClick={() => setSystem({...system, theme: 'dark'})} className={`flex-1 py-3 border rounded-xl font-bold text-sm transition-all ${system.theme === 'dark' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-500 hover:border-slate-300'}`}>Dark Mode</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bahasa</label>
                  <select value={system.language} onChange={e => setSystem({...system, language: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Format Waktu</label>
                  <div className="flex gap-3">
                    <button onClick={() => setSystem({...system, time_format: '24h'})} className={`flex-1 py-3 border rounded-xl font-bold text-sm transition-all ${system.time_format === '24h' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>24 Jam (14:30)</button>
                    <button onClick={() => setSystem({...system, time_format: '12h'})} className={`flex-1 py-3 border rounded-xl font-bold text-sm transition-all ${system.time_format === '12h' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>12 Jam (02:30 PM)</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Default Page (Saat Login)</label>
                  <select value={system.default_page} onChange={e => setSystem({...system, default_page: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                    <option value="dashboard">Dashboard Utama</option>
                    <option value="todo">To Do List</option>
                    <option value="finance">Finance Dashboard</option>
                    <option value="spiritual">Spiritual Dashboard</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleUpdateSystem} className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
                  <FaSave /> Simpan Preferensi
                </button>
              </div>
            </div>
          )}

          {/* 4. SPIRITUAL SETTINGS */}
          {activeTab === 'spiritual' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in-down">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                <FaMosque className="text-emerald-500" /> Spiritual Settings
              </h3>
              
              <div className="space-y-8 mb-8">
                <div className="flex items-center justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-emerald-900 mb-1">Target Halaman Al-Quran / Hari</h4>
                    <p className="text-xs text-emerald-700 font-medium">Berapa halaman target minimal bacaan Anda setiap hari?</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSpiritual({...spiritual, quran_target_page: Math.max(1, spiritual.quran_target_page - 1)})} className="w-8 h-8 bg-white border border-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-600">-</button>
                    <span className="font-black text-xl text-emerald-800 w-6 text-center">{spiritual.quran_target_page}</span>
                    <button onClick={() => setSpiritual({...spiritual, quran_target_page: spiritual.quran_target_page + 1})} className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Aktifkan Puasa Senin Kamis</h4>
                    <p className="text-xs text-slate-500 font-medium">Tampilkan widget puasa di halaman spiritual.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={spiritual.puasa_senin_kamis === 1} onChange={() => setSpiritual({...spiritual, puasa_senin_kamis: spiritual.puasa_senin_kamis === 1 ? 0 : 1})} />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Rekomendasi Doa Setelah Sholat</h4>
                    <p className="text-xs text-slate-500 font-medium">Pop-up otomatis untuk membaca doa saat mencentang sholat wajib.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={spiritual.doa_after_sholat === 1} onChange={() => setSpiritual({...spiritual, doa_after_sholat: spiritual.doa_after_sholat === 1 ? 0 : 1})} />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleUpdateSpiritual} className="px-8 py-3.5 bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
                  <FaSave /> Simpan Target
                </button>
              </div>
            </div>
          )}

          {/* 5. DATA & BACKUP */}
          {activeTab === 'backup' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-in-down">
              <h3 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Data & Backup</h3>
              
              <div className="space-y-6 mb-8">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">Export Data JSON</h4>
                    <p className="text-xs text-slate-500 font-medium">Unduh seluruh catatan keuangan, target hidup, kebiasaan, dan data spiritual Anda ke file lokal.</p>
                  </div>
                  <button onClick={handleExportData} className="w-full md:w-auto px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-600 transition-all">
                    <FaDownload /> Download JSON
                  </button>
                </div>

                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="font-bold text-red-800 text-base mb-1 flex items-center gap-2">Zona Berbahaya <FaShieldAlt /></h4>
                    <p className="text-xs text-red-600 font-medium">Hapus seluruh riwayat log, transaksi, dan progress. Sistem akan kembali kosong seperti baru.</p>
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg">
                    <FaTrashAlt /> Factory Reset
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Settings;