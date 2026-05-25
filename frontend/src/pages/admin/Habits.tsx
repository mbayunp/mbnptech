// src/pages/admin/Habits.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import {
  FaFire, FaCheckCircle, FaCalendarCheck,
  FaChartLine, FaPlus, FaTimes, FaTrophy, FaEdit, FaChevronLeft, FaChevronRight, FaHistory, FaQuoteLeft
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticGlowCard from '../../components/MagneticGlowCard';
import ActivityHeatmap from '../../components/ActivityHeatmap';

interface Habit {
  id: number;
  title: string;
  target_per_week: number;
  color: string;
}

interface HabitLog {
  habit_id: number;
  log_date: string; // YYYY-MM-DD
}

const colorMap: Record<string, {
  bg: string;
  text: string;
  border: string;
  badge: string;
  fill: string;
  ring: string;
  barColor: string;
}> = {
  blue: {
    bg: 'bg-blue-50/50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-500/20',
    badge: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    fill: '#3B82F6',
    ring: 'stroke-blue-500',
    barColor: 'url(#grad-blue)'
  },
  emerald: {
    bg: 'bg-emerald-50/50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-450',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    badge: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
    fill: '#10B981',
    ring: 'stroke-emerald-500',
    barColor: 'url(#grad-emerald)'
  },
  rose: {
    bg: 'bg-rose-50/50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-450',
    border: 'border-rose-100 dark:border-rose-500/20',
    badge: 'bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
    fill: '#F43F5E',
    ring: 'stroke-rose-500',
    barColor: 'url(#grad-rose)'
  },
  amber: {
    bg: 'bg-amber-50/50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-455',
    border: 'border-amber-100 dark:border-amber-500/20',
    badge: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    fill: '#F59E0B',
    ring: 'stroke-amber-500',
    barColor: 'url(#grad-amber)'
  },
  indigo: {
    bg: 'bg-indigo-50/50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-500/20',
    badge: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
    fill: '#6366F1',
    ring: 'stroke-indigo-500',
    barColor: 'url(#grad-indigo)'
  }
};

const Habits = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  // State Waktu Saat Ini
  const todayDate = new Date();
  const thisMonth = todayDate.getMonth();
  const thisYear = todayDate.getFullYear();

  const [historyMonth, setHistoryMonth] = useState(thisMonth);
  const [historyYear, setHistoryYear] = useState(thisYear);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API_URL}/api/life/habits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setHabits(result.data.habits);
        setLogs(result.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const heatmapData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.log_date] = (counts[log.log_date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [logs]);

  const getTodayString = () => {
    const today = new Date();
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  };

  const isCompletedOnDate = (habitId: number, dateStr: string) => {
    return logs.some(log => log.habit_id === habitId && log.log_date === dateStr);
  };

  const isCompletedToday = (habitId: number) => {
    return isCompletedOnDate(habitId, getTodayString());
  };

  const calculateStreak = (habitId: number) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const localDate = new Date(checkDate.getTime() - (checkDate.getTimezoneOffset() * 60000));
      const dateStr = localDate.toISOString().split('T')[0];
      
      const done = isCompletedOnDate(habitId, dateStr);

      if (done) {
        streak++;
      } else {
        if (i === 0) continue; // Boleh bolong hari ini jika belum diisi
        break;
      }
    }
    return streak;
  };

  const getThisWeekProgress = (habitId: number) => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDay(); // 0 = Sun, 1 = Mon, ...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Menyesuaikan agar mulai Senin
    const monday = new Date(today.setDate(diff));

    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
      const dateStr = localDate.toISOString().split('T')[0];
      const todayStr = getTodayString();

      days.push({
        dayName: dayNames[i],
        done: isCompletedOnDate(habitId, dateStr),
        isToday: dateStr === todayStr
      });
    }
    return days;
  };

  const generateDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      days.push(localDate.toISOString().split('T')[0]);
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handlePrevHistoryMonth = () => {
    if (historyMonth === 0) {
      setHistoryMonth(11);
      setHistoryYear(y => y - 1);
    } else {
      setHistoryMonth(m => m - 1);
    }
  };

  const handleNextHistoryMonth = () => {
    if (isFutureHistoryMonth()) return;
    if (historyMonth === 11) {
      setHistoryMonth(0);
      setHistoryYear(y => y + 1);
    } else {
      setHistoryMonth(m => m + 1);
    }
  };

  const isFutureHistoryMonth = () => {
    if (historyYear > thisYear) return true;
    if (historyYear === thisYear && historyMonth >= thisMonth) return true;
    return false;
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const historyMonthDays = generateDaysInMonth(historyYear, historyMonth);

  const handleToggleToday = async (habitId: number) => {
    try {
      const token = localStorage.getItem('token');
      const todayStr = getTodayString();
      const alreadyDone = isCompletedToday(habitId);

      if (alreadyDone) {
        setLogs(logs.filter(l => !(l.habit_id === habitId && l.log_date === todayStr)));
      } else {
        setLogs([...logs, { habit_id: habitId, log_date: todayStr }]);
      }

      const res = await fetch(`${API_URL}/api/life/habits/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ habit_id: habitId, log_date: todayStr })
      });

      if (!res.ok) {
        fetchHabits();
        Swal.fire('Error', 'Gagal update ke server', 'error');
      }
    } catch (err) { 
      console.error(err); 
      fetchHabits();
    }
  };

  const handleAddHabit = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Habit Baru',
      html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Nama Habit</label>
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white" placeholder="Misal: Olahraga Pagi">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target / Minggu</label>
        <input id="swal-target" type="number" min="1" max="7" class="w-full p-3 mb-3 border rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white" value="5">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tema Warna</label>
        <select id="swal-color" class="w-full p-3 border rounded-lg bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-white/10 dark:text-white">
          <option value="blue">Blue</option>
          <option value="emerald">Emerald (Green)</option>
          <option value="rose">Rose (Red)</option>
          <option value="amber">Amber (Yellow)</option>
          <option value="indigo">Indigo (Purple)</option>
        </select>
      `,
      showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#2563EB', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        if (!title) { Swal.showValidationMessage('Nama habit wajib diisi!'); return false; }
        return {
          title,
          target_per_week: parseInt((document.getElementById('swal-target') as HTMLInputElement).value) || 7,
          color: (document.getElementById('swal-color') as HTMLSelectElement).value
        };
      }
    });

    if (formValues) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/life/habits`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formValues)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Habit Dibuat!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
          fetchHabits();
        }
      } catch (err) { Swal.fire('Error', 'Gagal menambah habit', 'error'); }
    }
  };

  const handleEditHabit = async (habit: Habit) => {
    const result = await Swal.fire({
      title: 'Edit Habit',
      html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Nama Habit</label>
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white" value="${habit.title}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target / Minggu</label>
        <input id="swal-target" type="number" min="1" max="7" class="w-full p-3 mb-3 border rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white" value="${habit.target_per_week}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tema Warna</label>
        <select id="swal-color" class="w-full p-3 border rounded-lg bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-white/10 dark:text-white">
          <option value="blue" ${habit.color === 'blue' ? 'selected' : ''}>Blue</option>
          <option value="emerald" ${habit.color === 'emerald' ? 'selected' : ''}>Emerald (Green)</option>
          <option value="rose" ${habit.color === 'rose' ? 'selected' : ''}>Rose (Red)</option>
          <option value="amber" ${habit.color === 'amber' ? 'selected' : ''}>Amber (Yellow)</option>
          <option value="indigo" ${habit.color === 'indigo' ? 'selected' : ''}>Indigo (Purple)</option>
        </select>
      `,
      showCancelButton: true, showDenyButton: true,
      confirmButtonText: 'Update', denyButtonText: 'Hapus', confirmButtonColor: '#2563EB', denyButtonColor: '#ef4444', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        if (!title) { Swal.showValidationMessage('Nama habit wajib diisi!'); return false; }
        return {
          title,
          target_per_week: parseInt((document.getElementById('swal-target') as HTMLInputElement).value) || 7,
          color: (document.getElementById('swal-color') as HTMLSelectElement).value
        };
      }
    });

    const token = localStorage.getItem('token');

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/life/habits/${habit.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(result.value)
        });
        if (res.ok) { Swal.fire({ icon: 'success', title: 'Diperbarui!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchHabits(); }
      } catch (err) { Swal.fire('Error', 'Gagal update', 'error'); }
    } else if (result.isDenied) {
      const confirmDelete = await Swal.fire({ title: 'Hapus Habit?', text: "Data log juga akan terhapus.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' } });
      if (confirmDelete.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/api/life/habits/${habit.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) { Swal.fire({ icon: 'success', title: 'Dihapus!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchHabits(); }
        } catch (err) { Swal.fire('Error', 'Gagal hapus', 'error'); }
      }
    }
  };

  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => isCompletedToday(h.id)).length;

  let longestStreak = 0;
  let bestHabit = habits.length > 0 ? habits[0] : null;

  habits.forEach(h => {
    const s = calculateStreak(h.id);
    if (s > longestStreak) {
      longestStreak = s;
      bestHabit = h;
    }
  });

  const totalLogsLast7Days = logs.filter(l => {
    const logD = new Date(l.log_date);
    const today = new Date();
    const diff = (today.getTime() - logD.getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  }).length;
  const target7Days = habits.reduce((acc, h) => acc + h.target_per_week, 0);
  const consistencyPercent = target7Days === 0 ? 0 : Math.min(100, Math.round((totalLogsLast7Days / target7Days) * 100));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border border-slate-200/50 dark:border-white/[0.05] p-3 rounded-2xl shadow-xl">
          <p className="text-xs font-black text-slate-800 dark:text-white mb-1">{data.fullName}</p>
          <p className="text-xs font-bold text-rose-500 flex items-center gap-1">
            <FaFire /> <span>{data.Score} Streak</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#030712]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="max-w-8xl mx-auto pb-20 dark:text-white"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            <FaChartLine className="text-blue-600 dark:text-blue-450" /> Habits Hub
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Pantau dan tingkatkan konsistensi rutinitas kebaikan harian Anda.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddHabit} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 dark:bg-blue-650 dark:hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md">
            <FaPlus /> Add Habit
          </button>
        </div>
      </div>

      {/* Habit Summary Bento Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[
          { title: "Total Habits", val: totalHabits, icon: <FaCalendarCheck />, bgClass: "bg-blue-50 dark:bg-blue-600/10 text-blue-500" },
          { title: "Completed Today", val: `${completedTodayCount} / ${totalHabits}`, icon: <FaCheckCircle />, bgClass: "bg-emerald-50 dark:bg-emerald-600/10 text-emerald-500" },
          { title: "Longest Streak", val: `${longestStreak} Hari`, icon: <FaFire />, bgClass: "bg-rose-50 dark:bg-rose-600/10 text-rose-500" },
          { title: "Weekly Consistency", val: `${consistencyPercent}%`, icon: <FaTrophy />, bgClass: "bg-amber-50 dark:bg-amber-600/10 text-amber-500" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0B0F19] p-6 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05] flex items-center gap-4 hover:shadow-md transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.bgClass}`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{item.title}</p>
              <h4 className="text-xl font-black text-slate-800 dark:text-white leading-none">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        {/* Habit Checklist (Kiri) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05] min-h-[400px]">
            <div className="flex items-center justify-between mb-6 border-b dark:border-white/5 pb-4">
              <h3 className="flex items-center gap-2 text-base font-black text-slate-800 dark:text-white font-display"><FaFire className="text-rose-500" /> Target Minggu Ini</h3>
              <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5">Senin - Minggu</span>
            </div>

            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                  <FaCalendarCheck size={36} className="mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Belum ada habit yang ditambahkan.</p>
                </div>
              ) : (
                habits.map(habit => {
                  const streak = calculateStreak(habit.id);
                  const thisWeekProgress = getThisWeekProgress(habit.id);
                  const completedThisWeek = thisWeekProgress.filter(d => d.done).length;
                  const target = habit.target_per_week;
                  const percent = target === 0 ? 0 : Math.min(100, Math.round((completedThisWeek / target) * 100));
                  const classes = colorMap[habit.color] || colorMap.blue;

                  return (
                    <div key={habit.id} className="relative flex flex-col justify-between gap-4 p-5 transition-all border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#151b2c]/10 rounded-2xl md:flex-row md:items-center group hover:border-blue-400/55 dark:hover:border-blue-500/20 hover:shadow-sm">
                      <button onClick={() => handleEditHabit(habit)} className="absolute transition-all opacity-100 top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white md:opacity-0 group-hover:opacity-100" title="Edit Habit">
                        <FaEdit size={14} />
                      </button>

                      {/* Info & Circular Ring Progress */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-12 h-12 shrink-0">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="3" fill="transparent" />
                            <circle 
                              cx="24" 
                              cy="24" 
                              r="20" 
                              className={`${classes.ring} transition-all duration-500`} 
                              strokeWidth="3.5" 
                              fill="transparent" 
                              strokeDasharray="125.6" 
                              strokeDashoffset={125.6 - (125.6 * percent) / 100} 
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-650 dark:text-slate-350">{percent}%</div>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-black text-slate-800 dark:text-white text-base leading-tight">{habit.title}</h4>
                            <span className={`${classes.badge} text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-0.5`}>
                              <FaFire className="text-rose-500 animate-pulse" /> {streak} Streak
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Target: <strong className="text-slate-700 dark:text-slate-300">{completedThisWeek} / {target}x per minggu</strong></p>
                        </div>
                      </div>

                      {/* Checklist Weekdays */}
                      <div className="flex items-center gap-1.5 pb-2 overflow-x-auto shrink-0 scrollbar-none md:pb-0">
                        {thisWeekProgress.map((day, i) => (
                          <div key={i} className="flex flex-col items-center gap-1 px-0.5">
                            <span className={`text-[9px] font-black uppercase ${day.isToday ? 'text-blue-500 font-extrabold' : 'text-slate-400'}`}>{day.dayName}</span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${
                              day.done 
                                ? `${classes.bg} ${classes.text} shadow-inner` 
                                : day.isToday 
                                  ? 'bg-white dark:bg-slate-900 border-2 border-dashed border-blue-200 dark:border-blue-500/30 text-transparent' 
                                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-transparent text-transparent'
                            }`}>
                              <FaCheckCircle size={10} className={day.done ? 'scale-110' : ''} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action */}
                      <div className="w-full shrink-0 md:w-auto md:ml-4">
                        <button
                          onClick={() => handleToggleToday(habit.id)}
                          className={`w-full md:w-auto px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                            isCompletedToday(habit.id) 
                              ? 'bg-slate-200 dark:bg-white/10 text-slate-750 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/15' 
                              : `${classes.bg} ${classes.text} hover:scale-105 border ${classes.border}`
                          }`}
                        >
                          {isCompletedToday(habit.id) ? <><FaTimes /> Batal</> : <><FaCheckCircle /> Selesai Hari Ini</>}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="flex flex-col gap-6">
          {/* Consistency Chart */}
          <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05] h-fit">
            <h3 className="mb-6 text-base font-black text-slate-800 dark:text-white font-display">📈 Habits Consistency</h3>
            <div className="w-full h-48">
              {habits.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={habits.map(h => ({ name: h.title.split(' ')[0], fullName: h.title, Score: calculateStreak(h.id), colorName: h.color }))}
                    margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2}/></linearGradient>
                      <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="100%" stopColor="#10B981" stopOpacity={0.2}/></linearGradient>
                      <linearGradient id="grad-rose" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F43F5E" stopOpacity={0.8}/><stop offset="100%" stopColor="#F43F5E" stopOpacity={0.2}/></linearGradient>
                      <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8}/><stop offset="100%" stopColor="#F59E0B" stopOpacity={0.2}/></linearGradient>
                      <linearGradient id="grad-indigo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/><stop offset="100%" stopColor="#6366F1" stopOpacity={0.2}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <RechartsTooltip cursor={{ fill: 'rgba(148, 163, 184, 0.03)' }} content={<CustomTooltip />} />
                    <Bar dataKey="Score" radius={[6, 6, 0, 0]} maxBarSize={30}>
                      {habits.map((h, index) => {
                        const classes = colorMap[h.color] || colorMap.blue;
                        return <Cell key={`cell-${index}`} fill={classes.barColor} />
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-bold tracking-widest uppercase text-slate-400">No Data</div>
              )}
            </div>
          </div>

          {/* Daily Quote / Insight */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-6 md:p-8 rounded-[2rem] shadow-sm relative overflow-hidden text-white border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 rounded-full pointer-events-none bg-white/10 blur-2xl translate-x-1/4"></div>
            <div className="relative z-10">
              <h3 className="flex items-center gap-2 mb-4 text-xs font-black tracking-widest text-blue-200 uppercase"><FaQuoteLeft className="text-amber-400" /> Daily Insight</h3>
              <p className="mb-6 text-sm italic font-medium leading-relaxed text-slate-100">
                "Satu langkah kecil setiap hari jauh lebih baik daripada satu lompatan besar yang hanya dilakukan sebulan sekali."
              </p>
              <div className="pt-5 border-t border-white/10">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1">Pencapaian Terbaik Anda</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center justify-center w-10 h-10 text-lg border bg-white/15 rounded-xl text-amber-400 border-white/20"><FaTrophy /></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-white text-sm truncate pr-2">{bestHabit ? bestHabit.title : 'Belum Ada Habit'}</h4>
                    <p className="text-[10px] font-bold text-blue-200">{longestStreak} Hari Berturut-turut!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HABIT HEATMAP */}
      <div className="mb-8">
        <ActivityHeatmap data={heatmapData} type="habits" />
      </div>

      {/* Rekap Arsip Bulanan */}
      <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
        <div className="flex flex-col justify-between gap-4 pb-6 mb-8 border-b dark:border-white/5 border-slate-150 sm:flex-row sm:items-center">
          <h3 className="flex items-center gap-2 text-base font-black text-slate-800 dark:text-white font-display"><FaHistory className="text-indigo-500" /> Arsip Jejak Bulanan</h3>
          
          {/* Controller Kalender History */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/10 p-1 rounded-xl shadow-sm">
            <button onClick={handlePrevHistoryMonth} className="p-2 transition-colors bg-white dark:bg-[#0B0F19] border rounded-lg text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 border-slate-200/50 dark:border-white/5"><FaChevronLeft size={12} /></button>
            <span className="text-xs font-black tracking-widest text-center uppercase text-slate-700 dark:text-slate-350 w-36">{monthNames[historyMonth]} {historyYear}</span>
            <button onClick={handleNextHistoryMonth} disabled={isFutureHistoryMonth()} className={`p-2 rounded-lg transition-colors border ${isFutureHistoryMonth() ? 'bg-slate-100 text-slate-200 dark:bg-white/5 dark:text-slate-700 border-slate-150 dark:border-transparent cursor-not-allowed' : 'bg-white dark:bg-[#0B0F19] text-slate-405 border-slate-200/50 dark:border-white/5 hover:text-indigo-650 hover:bg-indigo-50'}`}><FaChevronRight size={12} /></button>
          </div>
        </div>

        {habits.length === 0 ? (
          <p className="py-10 text-xs font-bold tracking-widest text-center uppercase text-slate-450 dark:text-slate-500">Belum ada habit yang diarsipkan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {habits.map(habit => {
              const completedThisHistoryMonth = historyMonthDays.filter(dateStr => isCompletedOnDate(habit.id, dateStr)).length;
              const classes = colorMap[habit.color] || colorMap.blue;

              return (
                <div key={`history-${habit.id}`} className="p-5 transition-all border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#151b2c]/10 rounded-3xl hover:border-indigo-400/50 dark:hover:border-indigo-500/20">
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/50 dark:border-white/5">
                    <h4 className="pr-4 font-black truncate text-slate-700 dark:text-slate-300 text-sm">{habit.title}</h4>
                    <p className={`text-[9px] shrink-0 font-black ${classes.text} ${classes.bg} border ${classes.border} px-2.5 py-1 rounded-lg uppercase tracking-wider`}>
                      {completedThisHistoryMonth} Selesai
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {historyMonthDays.map((dateStr, idx) => {
                      const done = isCompletedOnDate(habit.id, dateStr);
                      const dayNum = idx + 1; 
                      return (
                        <div
                          key={`hist-${dateStr}`}
                          title={`${dateStr} ${done ? '(Selesai)' : '(Terlewat)'}`}
                          className={`w-7 h-7 rounded-lg text-[9px] font-black flex items-center justify-center transition-all cursor-help ${
                            done 
                              ? `bg-${habit.color}-500 text-white shadow-sm scale-105` 
                              : 'bg-white dark:bg-[#0B0F19] border border-slate-200/50 dark:border-white/5 text-slate-300 dark:text-slate-655 hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {dayNum}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Habits;