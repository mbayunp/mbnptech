// src/components/layout/AdminLayout.tsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaThLarge, FaWallet, FaChartPie, FaTasks,
  FaFolderOpen, FaEnvelope, FaCog, FaSignOutAlt,
  FaBars, FaBell, FaSearch, FaGlobe, FaListUl, FaMedal, FaHistory
} from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({ name: 'Admin', initial: 'A' });
  const navigate = useNavigate();

  // --- PROTEKSI ROUTE & AMBIL DATA USER ---
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Jika tidak ada token, lempar ke login
    if (!token) {
      navigate('/login');
      return;
    }

    // Ambil data user dari localStorage untuk ditampilkan di Topbar
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.name,
        initial: user.name.charAt(0).toUpperCase() // Ambil huruf pertama untuk avatar
      });
    }
  }, [navigate]);

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: "Sesi Anda akan diakhiri.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus data autentikasi
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Arahkan ke halaman login
        navigate('/login');
      }
    });
  };

  // Menyesuaikan menu dengan Konsep Life Planning yang baru
  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaThLarge /> },
    { path: '/admin/activity', name: 'Activity Log', icon: <FaHistory /> },
    { path: '/admin/finance', name: 'Finance', icon: <FaWallet /> },
    { path: '/admin/todo', name: 'To Do List', icon: <FaTasks /> },
    { path: '/admin/planing', name: 'Life Planning', icon: <FaFolderOpen /> },
    { path: '/admin/habits', name: 'Habits Tracker', icon: <FaListUl /> },
    { path: '/admin/achievements', name: 'Achievements', icon: <FaMedal /> },
    { path: '/admin/inquiry', name: 'Inquiry', icon: <FaEnvelope /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl z-20 shrink-0`}
      >
        {/* AREA LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-slate-800 transition-all duration-300">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/logo1.png" alt="MBNP Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <h1 className="text-xl font-black text-white tracking-tight whitespace-nowrap">
                MBNP <span className="text-blue-500">Tech</span>
              </h1>
            </div>
          ) : (
            <img src="/logo1.png" alt="MBNP Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-transform hover:scale-110" />
          )}
        </div>

        {/* MENU UTAMA */}
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar border-b border-slate-800">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
                      : 'hover:bg-slate-800 hover:text-white'
                    } ${!isSidebarOpen ? 'justify-center' : ''}`
                  }
                  title={!isSidebarOpen ? item.name : ""}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="text-sm truncate">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* MENU BAWAH (Web Public & Logout) */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => window.open('/', '_blank')} 
            className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}
            title={!isSidebarOpen ? "Lihat Website" : ""}
          >
            <FaGlobe className="text-lg shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold truncate">Lihat Website</span>}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <FaSignOutAlt className="text-lg shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-blue-600 transition-colors p-2 bg-slate-100 rounded-lg"
            >
              <FaBars className="text-xl" />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 w-96 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
              <FaSearch className="text-slate-400 mr-3" />
              <input type="text" placeholder="Cari transaksi, task, atau target..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">

              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">{userData.name}</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg border-2 border-white shadow-sm">
                {userData.initial}
              </div>

            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;