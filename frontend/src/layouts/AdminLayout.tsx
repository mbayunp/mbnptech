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

const CITIES = { 'Garut': '1208', 'Bandung': '1219', 'Cianjur': '1205' };

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin', initial: 'A', profile_picture: '' });
  const [newInquiries, setNewInquiries] = useState<any[]>([]);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  const audioAdzanRef = useRef<HTMLAudioElement | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [lastAdzanPlayed, setLastAdzanPlayed] = useState<string>('');

  // ==========================================
  // GLOBAL POMODORO TIMER STATE (NORMAL TIME)
  // ==========================================
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>(() => (localStorage.getItem('pomo_mode') as any) || 'focus');
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pomo_timeLeft');
    return saved ? parseInt(saved) : 25 * 60; // 25 Menit
  });
  const [isActive, setIsActive] = useState(() => localStorage.getItem('pomo_isActive') === 'true');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => localStorage.getItem('pomo_activeTaskId'));

  const timerRef = useRef<any>(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success && result.data.profile) {
        setUserData({
          name: result.data.profile.name || 'Admin',
          initial: result.data.profile.name ? result.data.profile.name.charAt(0).toUpperCase() : 'A',
          profile_picture: result.data.profile.profile_picture || ''
        });
      }
    } catch (err) { console.error(err); }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/inquiries`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setNewInquiries(result.data.filter((i: any) => i.status === 'New'));
    } catch (err) { console.error(err); }
  };

  const fetchPrayerTimes = async () => {
    try {
      const city = (localStorage.getItem('mbnp_city') as keyof typeof CITIES) || 'Garut';
      const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }).replace(/-/g, '/');
      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${CITIES[city]}/${dateStr}`);
      const data = await response.json();
      if(data.status) setPrayerTimes(data.data.jadwal);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    fetchUserData();
    fetchNotifications();
    fetchPrayerTimes();

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    audioAdzanRef.current = new Audio('/adzan.mp3');

    const handleClickOutside = (e: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('user-profile-updated', fetchUserData);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('user-profile-updated', fetchUserData);
    };
  }, [navigate]);

  useEffect(() => {
    if (!prayerTimes) return;
    const checkAdzan = setInterval(() => {
      const currentLocalTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
      const timesToCheck = [
        { name: 'Subuh', time: prayerTimes.subuh }, { name: 'Dzuhur', time: prayerTimes.dzuhur },
        { name: 'Ashar', time: prayerTimes.ashar }, { name: 'Maghrib', time: prayerTimes.maghrib }, { name: 'Isya', time: prayerTimes.isya }
      ];

      timesToCheck.forEach(prayer => {
        if (currentLocalTime === prayer.time && lastAdzanPlayed !== prayer.name) {
          setLastAdzanPlayed(prayer.name);
          if (audioAdzanRef.current) audioAdzanRef.current.play().catch(e => console.log(e));

          Swal.fire({
            title: `Waktunya Sholat ${prayer.name} 🕌`,
            text: `Mari tinggalkan sejenak pekerjaan, penuhi panggilan Allah.`,
            icon: 'info', showCancelButton: true, confirmButtonText: 'Tandai Selesai (Ibadah)', cancelButtonText: 'Matikan Suara', confirmButtonColor: '#10B981'
          }).then((result) => {
            if (audioAdzanRef.current) { audioAdzanRef.current.pause(); audioAdzanRef.current.currentTime = 0; }
            if (result.isConfirmed) { navigate('/admin/spiritual'); }
          });
        }
      });
    }, 30000);
    return () => clearInterval(checkAdzan);
  }, [prayerTimes, lastAdzanPlayed, navigate]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current); 
    
    const soundFile = timerMode === 'focus' ? '/alarm.mp3' : '/alarm2.mp3';
    try { const audio = new Audio(soundFile); audio.volume = 1.0; await audio.play(); } catch (e) { console.log(e); }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Waktu Habis!", { body: timerMode === 'focus' ? "Kerja bagus! Saatnya istirahat." : "Istirahat selesai. Kembali fokus yuk!", icon: "/favicon.ico" });
    }

    Swal.fire({
      title: timerMode === 'focus' ? 'Pomodoro Selesai! 🍅' : 'Istirahat Selesai! ☕',
      text: timerMode === 'focus' ? 'Ambil istirahat sejenak.' : 'Mari kembali bekerja.',
      icon: 'success', confirmButtonColor: '#2563EB'
    });

    if (timerMode === 'focus') {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/todos/pomodoro`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ taskId: activeTaskId, duration: 25 * 60 }) 
        });
        window.dispatchEvent(new Event('pomodoro-completed'));
      } catch (err) {}
      switchMode('shortBreak');
    } else {
      switchMode('focus');
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          const newTime = prevTime - 1;
          localStorage.setItem('pomo_timeLeft', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]); 

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
  }, [timeLeft, isActive]);

  useEffect(() => {
    localStorage.setItem('pomo_isActive', isActive.toString());
    localStorage.setItem('pomo_mode', timerMode);
    if (activeTaskId) localStorage.setItem('pomo_activeTaskId', activeTaskId);
  }, [isActive, timerMode, activeTaskId]);

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerMode(mode); setIsActive(false);
    
    let time = 25 * 60; 
    if (mode === 'shortBreak') time = 5 * 60;
    if (mode === 'longBreak') time = 15 * 60;
    
    setTimeLeft(time);
    localStorage.setItem('pomo_timeLeft', time.toString());
  };

  const toggleTimer = () => setIsActive(!isActive);

  const pomoContext = {
    timerMode, timeLeft, isActive, activeTaskId, 
    setActiveTaskId, switchMode, toggleTimer, handleTimerComplete
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Ya, Logout!'
    }).then((result) => {
      if (result.isConfirmed) { 
        if (timerRef.current) clearInterval(timerRef.current); 
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
        <div className="flex items-center justify-center h-20 transition-all duration-300 border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/logo1.png" alt="MBNP Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <h1 className="text-xl font-black tracking-tight text-white">MBNP <span className="text-blue-500">Tech</span></h1>
            </div>
          ) : (
            <img src="/logo1.png" alt="MBNP Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.path} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold' : 'hover:bg-slate-800 hover:text-white'} ${!isSidebarOpen ? 'justify-center' : ''}`} title={!isSidebarOpen ? item.name : ""}>
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="text-sm truncate">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 space-y-2 border-t border-slate-800">
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
      <div className="flex flex-col flex-1 min-w-0">
        {/* TOPBAR */}
        <header className="z-20 flex items-center justify-between h-20 px-4 bg-white border-b shadow-sm border-slate-200 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 transition-colors rounded-lg text-slate-500 hover:text-blue-600 bg-slate-100"><FaBars className="text-xl" /></button>
            <div className="hidden md:flex items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 w-96 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <FaSearch className="mr-3 text-slate-400" />
              <input type="text" placeholder="Cari data..." className="w-full text-sm bg-transparent border-none outline-none text-slate-700" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-blue-600'}`}>
                <FaBell className="text-xl" />
                {newInquiries.length > 0 && <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">{newInquiries.length}</span>}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between p-5 border-b border-slate-50 bg-slate-50/50">
                    <h4 className="text-sm font-black text-slate-800">Pesan Baru ({newInquiries.length})</h4>
                    <NavLink to="/admin/inquiry" onClick={() => setIsNotifOpen(false)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Lihat Semua</NavLink>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {newInquiries.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 p-10 text-center">
                        <div className="flex items-center justify-center w-12 h-12 text-xl rounded-full bg-slate-100 text-slate-300"><FaEnvelope /></div>
                        <p className="text-xs font-medium text-slate-400">Tidak ada pesan baru saat ini.</p>
                      </div>
                    ) : (
                      newInquiries.map((item) => (
                        <div key={item.id} onClick={() => { navigate('/admin/inquiry'); setIsNotifOpen(false); }} className="p-4 transition-colors border-b cursor-pointer border-slate-50 hover:bg-blue-50/50 group">
                          <div className="flex gap-3">
                            <div className="flex items-center justify-center w-10 h-10 text-sm font-black text-blue-600 uppercase bg-blue-100 rounded-full shrink-0">{item.name.charAt(0)}</div>
                            <div className="overflow-hidden">
                              <div className="flex justify-between items-start mb-0.5"><h5 className="pr-2 text-xs font-bold truncate text-slate-800">{item.name}</h5><span className="text-[9px] font-bold text-slate-400 shrink-0">Baru Saja</span></div>
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-1">{item.service}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">"{item.message}"</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {newInquiries.length > 0 && <div className="p-3 text-center border-t bg-slate-50 border-slate-100"><NavLink to="/admin/inquiry" onClick={() => setIsNotifOpen(false)} className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors">Buka Kotak Masuk</NavLink></div>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l md:pl-6 border-slate-200">
              <div className="hidden text-right md:block">
                <p className="text-sm font-black leading-tight text-slate-800">{userData.name}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="flex items-center justify-center overflow-hidden text-lg font-black text-white transition-transform border-2 border-white rounded-full shadow-md cursor-pointer w-11 h-11 hover:scale-105 bg-gradient-to-tr from-blue-600 to-indigo-600 shrink-0" onClick={() => navigate('/admin/settings')}>
                {userData.profile_picture ? (
                  <img src={userData.profile_picture.startsWith('http') ? userData.profile_picture : `${API_URL}${userData.profile_picture}`} alt="Profile" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerText = userData.initial; }} />
                ) : <span>{userData.initial}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
          <Outlet context={pomoContext} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;