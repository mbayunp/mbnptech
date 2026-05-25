// src/layouts/AdminLayout.tsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import JarvisWidget from '../components/JarvisWidget';
import { Sun, Moon } from 'lucide-react';
import {
  FaThLarge, FaWallet, FaTasks, FaFolderOpen, FaEnvelope,
  FaCog, FaSignOutAlt, FaBars, FaBell, FaSearch, FaGlobe,
  FaListUl, FaMedal, FaHistory, FaMosque, FaHeart, FaClock,
  FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaSun, FaMoon
} from 'react-icons/fa';

const CITIES = { 'Garut': '1208', 'Bandung': '1219', 'Cianjur': '1205' };

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isWeddingNotifOpen, setIsWeddingNotifOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin', initial: 'A', profile_picture: '' });
  const [newInquiries, setNewInquiries] = useState<any[]>([]);
  const [weddingStats, setWeddingStats] = useState({
    daysLeft: 0,
    pendingTasksCount: 0,
    budgetStatus: 'safe', // 'safe' | 'warning'
    totalBudget: 0,
    totalUsed: 0
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const weddingRef = useRef<HTMLDivElement>(null);
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

  // Live Clock Interval
  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

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

  const fetchWeddingStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/wedding`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) {
        const { summary, timeline } = result.data;
        const pendingTasksCount = (timeline || []).filter((t: any) => t.status !== 'done').length;

        // Target Date: December 25, 2026
        const weddingDate = new Date('2026-12-25');
        const diffTime = weddingDate.getTime() - new Date().getTime();
        const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        // Pending Budget Warning: warning if used exceeds budgeted allocation or total income
        let budgetStatus = 'safe';
        if (summary.totalUsed > summary.totalBudget || (summary.totalIncome > 0 && summary.totalUsed > summary.totalIncome)) {
          budgetStatus = 'warning';
        }

        setWeddingStats({
          daysLeft,
          pendingTasksCount,
          budgetStatus,
          totalBudget: summary.totalBudget,
          totalUsed: summary.totalUsed
        });
      }
    } catch (err) { console.error(err); }
  };

  const fetchPrayerTimes = async () => {
    try {
      const city = (localStorage.getItem('mbnp_city') as keyof typeof CITIES) || 'Garut';
      const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }).replace(/-/g, '/');
      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${CITIES[city]}/${dateStr}`);
      const data = await response.json();
      if (data.status) setPrayerTimes(data.data.jadwal);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    fetchUserData();
    fetchNotifications();
    fetchWeddingStats();
    fetchPrayerTimes();

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    audioAdzanRef.current = new Audio('/adzan.mp3');

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (weddingRef.current && !weddingRef.current.contains(e.target as Node)) {
        setIsWeddingNotifOpen(false);
      }
    };
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
      } catch (err) { }
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
    { path: '/admin/wedding', name: 'Wedding Planner', icon: <FaHeart /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka || 0);
  };

  const formattedDateString = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#030712] font-sans overflow-hidden transition-colors duration-300">
      {/* FLOATING SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-22'} my-4 ml-4 rounded-[2rem] transition-all duration-300 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl z-30 shrink-0 border border-white/[0.03] overflow-hidden`}>
        <div className="flex items-center justify-center h-20 transition-all duration-300 border-b border-slate-800/60 px-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/logo1.png" alt="MBNP Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <h1 className="text-lg font-black tracking-tight text-white">MBNP <span className="text-blue-500">System</span></h1>
            </div>
          ) : (
            <img src="/logo1.png" alt="MBNP Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          )}
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.path} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/10 font-bold' : 'hover:bg-slate-800/50 hover:text-white'} ${!isSidebarOpen ? 'justify-center px-0' : ''}`} title={!isSidebarOpen ? item.name : ""}>
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {isSidebarOpen && <span className="text-sm truncate">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 space-y-1.5 border-t border-slate-800/60 bg-slate-950/20">
          <button onClick={() => window.open('/', '_blank')} className={`flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-sky-400 hover:bg-sky-500/10 transition-all ${!isSidebarOpen ? 'justify-center px-0' : ''}`}>
            <FaGlobe className="text-base shrink-0" />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-wider">Web Portal</span>}
          </button>
          <button onClick={handleLogout} className={`flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 transition-all ${!isSidebarOpen ? 'justify-center px-0' : ''}`}>
            <FaSignOutAlt className="text-base shrink-0" />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-wider">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 min-w-0 p-4">
        {/* GLASS TOPBAR */}
        <header className="z-20 flex items-center justify-between h-20 px-6 rounded-3xl bg-white/70 dark:bg-[#0B0F19]/70 border border-slate-200/50 dark:border-white/[0.05] shadow-sm backdrop-blur-xl shrink-0 mb-4 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 transition-colors rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800/40"><FaBars className="text-base" /></button>
            
            {/* Live Clock / Calendar */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#141B2D]/40 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-100 dark:border-white/[0.03]">
              <FaClock className="text-blue-500" />
              <span>{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <FaCalendarAlt className="text-indigo-500" />
              <span>{formattedDateString}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-slate-200/40 dark:border-white/[0.03] transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="text-amber-400" size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATION INQUIRIES BELL */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsWeddingNotifOpen(false); }} className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
                <FaBell className="text-lg" />
                {newInquiries.length > 0 && <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#0B0F19] flex items-center justify-center animate-bounce">{newInquiries.length}</span>}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#0B0F19] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/[0.05] overflow-hidden z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-white/[0.02] bg-slate-50/50 dark:bg-slate-900/20">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">Pesan Baru ({newInquiries.length})</h4>
                    <NavLink to="/admin/inquiry" onClick={() => setIsNotifOpen(false)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase hover:underline">Lihat Semua</NavLink>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {newInquiries.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 p-10 text-center">
                        <div className="flex items-center justify-center w-12 h-12 text-xl rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"><FaEnvelope /></div>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Tidak ada pesan baru.</p>
                      </div>
                    ) : (
                      newInquiries.map((item) => (
                        <div key={item.id} onClick={() => { navigate('/admin/inquiry'); setIsNotifOpen(false); }} className="p-4 transition-colors border-b border-slate-50 dark:border-white/[0.02] cursor-pointer hover:bg-blue-50/50 dark:hover:bg-white/[0.02]">
                          <div className="flex gap-3">
                            <div className="flex items-center justify-center w-10 h-10 text-sm font-black text-blue-600 dark:text-blue-400 uppercase bg-blue-100 dark:bg-blue-600/10 rounded-full shrink-0">{item.name.charAt(0)}</div>
                            <div className="overflow-hidden w-full">
                              <div className="flex justify-between items-start mb-0.5"><h5 className="pr-2 text-xs font-bold truncate text-slate-800 dark:text-slate-200">{item.name}</h5><span className="text-[9px] font-bold text-slate-400 shrink-0">Baru Saja</span></div>
                              <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mb-1">{item.service}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">"{item.message}"</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WEDDING PLANNER ALERTS POPOVER */}
            <div className="relative" ref={weddingRef}>
              <button onClick={() => { setIsWeddingNotifOpen(!isWeddingNotifOpen); setIsNotifOpen(false); }} className={`relative p-2.5 rounded-xl transition-all ${isWeddingNotifOpen ? 'bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}>
                <FaHeart className="text-lg" />
                {weddingStats.pendingTasksCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#0B0F19] flex items-center justify-center animate-bounce">{weddingStats.pendingTasksCount}</span>
                )}
              </button>

              {isWeddingNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#0B0F19] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/[0.05] overflow-hidden z-50 animate-fade-in-up">
                  <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-white/[0.02] bg-rose-50/50 dark:bg-rose-950/20">
                    <h4 className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><FaHeart /> Wedding Planner Status</h4>
                    <NavLink to="/admin/wedding" onClick={() => setIsWeddingNotifOpen(false)} className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase hover:underline">Detail Planner</NavLink>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Countdown */}
                    <div className="flex items-center gap-3 p-3 bg-rose-50/60 dark:bg-rose-950/10 rounded-2xl border border-rose-100/50 dark:border-rose-900/20">
                      <FaCalendarAlt className="text-rose-500 text-lg shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Countdown Pernikahan</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{weddingStats.daysLeft} Hari Menuju Hari H</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Rencana Akad: 25 Des 2026</p>
                      </div>
                    </div>

                    {/* Pending Task Alert */}
                    <div className="flex items-center gap-3 p-3 bg-amber-50/60 dark:bg-amber-950/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/20">
                      <FaTasks className="text-amber-500 text-lg shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Wedding Task Alert</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{weddingStats.pendingTasksCount} Agenda Persiapan Pending</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Segera cek checklist agenda Anda.</p>
                      </div>
                    </div>

                    {/* Pending Budget Warning */}
                    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${weddingStats.budgetStatus === 'warning' ? 'bg-red-50/60 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/20' : 'bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-900/20'}`}>
                      {weddingStats.budgetStatus === 'warning' ? (
                        <FaExclamationTriangle className="text-red-500 text-lg shrink-0" />
                      ) : (
                        <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
                      )}
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${weddingStats.budgetStatus === 'warning' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {weddingStats.budgetStatus === 'warning' ? 'Pending Budget Warning' : 'Status Anggaran Pernikahan'}
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {weddingStats.budgetStatus === 'warning' ? 'Anggaran Defisit / Kurang!' : 'Dana Anggaran Stabil'}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Realisasi: {formatRp(weddingStats.totalUsed)} dari total {formatRp(weddingStats.totalBudget)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE ICON */}
            <div className="flex items-center gap-3 pl-4 border-l dark:border-white/10 border-slate-200">
              <div className="hidden text-right md:block">
                <p className="text-sm font-black leading-tight text-slate-800 dark:text-slate-200">{userData.name}</p>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="flex items-center justify-center overflow-hidden text-lg font-black text-white transition-transform border-2 border-white dark:border-[#0B0F19] rounded-full shadow-md cursor-pointer w-11 h-11 hover:scale-105 bg-gradient-to-tr from-blue-600 to-indigo-600 shrink-0" onClick={() => navigate('/admin/settings')}>
                {userData.profile_picture ? (
                  <img src={userData.profile_picture.startsWith('http') ? userData.profile_picture : `${API_URL}${userData.profile_picture}`} alt="Profile" className="object-cover w-full h-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerText = userData.initial; }} />
                ) : <span>{userData.initial}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-2 md:p-4 rounded-3xl bg-slate-50 dark:bg-[#030712] border border-slate-200/40 dark:border-white/[0.02]">
          <Outlet context={pomoContext} />
        </main>

        {/* GLOBAL JARVIS AI WIDGET */}
        <JarvisWidget />
      </div>
    </div>
  );
};

export default AdminLayout;