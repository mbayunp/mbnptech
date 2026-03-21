// src/components/layout/AdminLayout.tsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../config/api'; 
import {
  FaThLarge, FaWallet, FaTasks, FaFolderOpen, FaEnvelope, 
  FaCog, FaSignOutAlt, FaBars, FaBell, FaSearch, FaGlobe, 
  FaListUl, FaMedal, FaHistory, FaMosque
} from 'react-icons/fa';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin', initial: 'A', profile_picture: '' });
  const [newInquiries, setNewInquiries] = useState<any[]>([]);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  // --- 1. FETCH DATA USER LANGSUNG DARI DATABASE ---
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.success && result.data.profile) {
        const profile = result.data.profile;
        setUserData({
          name: profile.name || 'Admin',
          initial: profile.name ? profile.name.charAt(0).toUpperCase() : 'A',
          profile_picture: profile.profile_picture || ''
        });
      }
    } catch (err) {
      console.error("Gagal mengambil data user dari DB:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Panggil DB saat layout pertama kali dimuat
    fetchUserData();
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('user-profile-updated', fetchUserData);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('user-profile-updated', fetchUserData);
    };
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/inquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        const filtered = result.data.filter((i: any) => i.status === 'New');
        setNewInquiries(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    }
  };

  // --- 2. LOGOUT ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: "Sesi Anda akan diakhiri.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Ya, Logout!',
      customClass: { popup: 'rounded-3xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaThLarge /> },
    { path: '/admin/activity', name: 'Activity Log', icon: <FaHistory /> },
    { path: '/admin/finance', name: 'Finance', icon: <FaWallet /> },
    { path: '/admin/todo', name: 'To Do List', icon: <FaTasks /> },
    { path: '/admin/planing', name: 'Life Planning', icon: <FaFolderOpen /> },
    { path: '/admin/habits', name: 'Habits Tracker', icon: <FaListUl /> },
    { path: '/admin/achievements', name: 'Achievements', icon: <FaMedal /> },
    { path: '/admin/spiritual', name: 'Spiritual', icon: <FaMosque /> },
    { path: '/admin/inquiry', name: 'Inquiry', icon: <FaEnvelope /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl z-30 shrink-0`}>
        <div className="h-20 flex items-center justify-center border-b border-slate-800 transition-all duration-300">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/logo1.png" alt="MBNP Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <h1 className="text-xl font-black text-white tracking-tight">MBNP <span className="text-blue-500">Tech</span></h1>
            </div>
          ) : (
            <img src="/logo1.png" alt="MBNP Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
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

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={() => window.open('/', '_blank')} className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-sky-400 hover:bg-sky-500/10 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <FaGlobe className="text-lg shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold">Lihat Website</span>}
          </button>
          <button onClick={handleLogout} className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <FaSignOutAlt className="text-lg shrink-0" />
            {isSidebarOpen && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between z-20 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-blue-600 p-2 bg-slate-100 rounded-lg transition-colors">
              <FaBars className="text-xl" />
            </button>
            <div className="hidden md:flex items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 w-96 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <FaSearch className="text-slate-400 mr-3" />
              <input type="text" placeholder="Cari data..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            
            {/* NOTIFICATION CENTER */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}
              >
                <FaBell className="text-xl" />
                {newInquiries.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                    {newInquiries.length}
                  </span>
                )}
              </button>

              {/* DROPDOWN NOTIF */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                  <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-black text-slate-800 text-sm">Pesan Baru ({newInquiries.length})</h4>
                    <NavLink to="/admin/inquiry" onClick={() => setIsNotifOpen(false)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Lihat Semua</NavLink>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {newInquiries.length === 0 ? (
                      <div className="p-10 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-xl"><FaEnvelope /></div>
                        <p className="text-xs text-slate-400 font-medium">Tidak ada pesan baru saat ini.</p>
                      </div>
                    ) : (
                      newInquiries.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => { navigate('/admin/inquiry'); setIsNotifOpen(false); }}
                          className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 uppercase">
                              {item.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex justify-between items-start mb-0.5">
                                <h5 className="font-bold text-slate-800 text-xs truncate pr-2">{item.name}</h5>
                                <span className="text-[9px] font-bold text-slate-400 shrink-0">Baru Saja</span>
                              </div>
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1">{item.service}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">"{item.message}"</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {newInquiries.length > 0 && (
                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                       <NavLink to="/admin/inquiry" onClick={() => setIsNotifOpen(false)} className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors">Buka Kotak Masuk</NavLink>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- USER PROFILE SECTION --- */}
            <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-800 leading-tight">{userData.name}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Super Admin</p>
              </div>
              
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shrink-0" 
                onClick={() => navigate('/admin/settings')}
              >
                {/* Menampilkan Gambar Langsung Dari DB */}
                {userData.profile_picture ? (
                  <img 
                    src={userData.profile_picture.startsWith('http') ? userData.profile_picture : `${API_URL}${userData.profile_picture}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerText = userData.initial;
                    }}
                  />
                ) : (
                  <span>{userData.initial}</span>
                )}
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