// src/pages/admin/Habits.tsx
import { useState, useEffect } from 'react';
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

const Habits = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);

    // State Waktu Saat Ini (Fixed)
    const todayDate = new Date();
    const thisMonth = todayDate.getMonth();
    const thisYear = todayDate.getFullYear();

    // ==========================================
    // PERBAIKAN: Set Jejak Bulanan Dimulai Dari Bulan Ini
    // ==========================================
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

    // --- ENGINE LOGIC ---
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

    // --- MONTHLY ENGINE ---
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

    // --- ACTIONS (CRUD) ---
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
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg" placeholder="Misal: Olahraga Pagi">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target / Minggu</label>
        <input id="swal-target" type="number" min="1" max="7" class="w-full p-3 mb-3 border rounded-lg" value="5">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tema Warna</label>
        <select id="swal-color" class="w-full p-3 border rounded-lg bg-white">
          <option value="blue">Blue</option>
          <option value="emerald">Emerald (Green)</option>
          <option value="rose">Rose (Red)</option>
          <option value="amber">Amber (Yellow)</option>
          <option value="indigo">Indigo (Purple)</option>
        </select>
      `,
            showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#2563EB',
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
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg" value="${habit.title}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target / Minggu</label>
        <input id="swal-target" type="number" min="1" max="7" class="w-full p-3 mb-3 border rounded-lg" value="${habit.target_per_week}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tema Warna</label>
        <select id="swal-color" class="w-full p-3 border rounded-lg bg-white">
          <option value="blue" ${habit.color === 'blue' ? 'selected' : ''}>Blue</option>
          <option value="emerald" ${habit.color === 'emerald' ? 'selected' : ''}>Emerald (Green)</option>
          <option value="rose" ${habit.color === 'rose' ? 'selected' : ''}>Rose (Red)</option>
          <option value="amber" ${habit.color === 'amber' ? 'selected' : ''}>Amber (Yellow)</option>
          <option value="indigo" ${habit.color === 'indigo' ? 'selected' : ''}>Indigo (Purple)</option>
        </select>
      `,
            showCancelButton: true, showDenyButton: true,
            confirmButtonText: 'Update', denyButtonText: 'Hapus', confirmButtonColor: '#2563EB', denyButtonColor: '#ef4444',
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
            const confirmDelete = await Swal.fire({ title: 'Hapus Habit?', text: "Data log juga akan terhapus.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
            if (confirmDelete.isConfirmed) {
                try {
                    const res = await fetch(`${API_URL}/api/life/habits/${habit.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                    if (res.ok) { Swal.fire({ icon: 'success', title: 'Dihapus!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchHabits(); }
                } catch (err) { Swal.fire('Error', 'Gagal hapus', 'error'); }
            }
        }
    };

    // --- STATISTIK GLOBAL ---
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

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div></div>;

    return (
        <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                    <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900">
                        <FaChartLine className="text-blue-600" /> Habit Tracker
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Pantau dan tingkatkan konsistensi kebiasaan harian Anda.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAddHabit} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                        <FaPlus /> Add Habit
                    </button>
                </div>
            </div>

            {/* 1️⃣ Habit Summary */}
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {[
                    { title: "Total Habits", val: totalHabits, icon: <FaCalendarCheck />, color: "blue" },
                    { title: "Completed Today", val: `${completedTodayCount} / ${totalHabits}`, icon: <FaCheckCircle />, color: "emerald" },
                    { title: "Longest Streak", val: `${longestStreak} Hari`, icon: <FaFire />, color: "rose" },
                    { title: "Weekly Consistency", val: `${consistencyPercent}%`, icon: <FaTrophy />, color: "amber" },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                            <h4 className="text-2xl font-black text-slate-800">{item.val}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">

                {/* 2️⃣ Habit Streak Tracker & List (Kiri) */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800"><FaFire className="text-rose-500" /> Target Minggu Ini</h3>
                            <span className="px-3 py-1 text-xs font-bold rounded-lg text-slate-500 bg-slate-100">Senin - Minggu</span>
                        </div>

                        <div className="space-y-6">
                            {habits.length === 0 ? <p className="py-10 font-medium text-center text-slate-400">Belum ada habit yang ditambahkan.</p> : habits.map(habit => {
                                const streak = calculateStreak(habit.id);
                                const thisWeekProgress = getThisWeekProgress(habit.id);

                                return (
                                    <div key={habit.id} className="relative flex flex-col justify-between gap-4 p-5 transition-shadow border bg-slate-50 border-slate-100 rounded-2xl xl:flex-row xl:items-center group hover:shadow-md">

                                        <button onClick={() => handleEditHabit(habit)} className="absolute transition-opacity opacity-100 top-4 right-4 text-slate-300 hover:text-slate-600 md:opacity-0 group-hover:opacity-100">
                                            <FaEdit />
                                        </button>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className={`font-bold text-slate-800 text-lg group-hover:text-${habit.color}-600 transition-colors`}>{habit.title}</h4>
                                                <span className={`bg-${habit.color}-50 text-${habit.color}-600 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 border border-${habit.color}-100`}>
                                                    <FaFire /> {streak} Streak
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500">Target: <strong className="text-slate-700">{habit.target_per_week}x / minggu</strong></p>
                                        </div>

                                        <div className="flex items-center gap-1 pb-2 my-2 overflow-x-auto shrink-0 xl:mr-8 xl:my-0 xl:pb-0">
                                            {thisWeekProgress.map((day, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1 px-1 shrink-0">
                                                    <span className={`text-[9px] font-bold ${day.isToday ? 'text-blue-600' : 'text-slate-400'}`}>{day.dayName}</span>
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${day.done ? `bg-${habit.color}-500 text-white shadow-md shadow-${habit.color}-500/30` : day.isToday ? 'bg-white border-2 border-blue-200 text-transparent' : 'bg-slate-200 text-transparent'}`}>
                                                        <FaCheckCircle />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="w-full shrink-0 xl:w-auto">
                                            <button
                                                onClick={() => handleToggleToday(habit.id)}
                                                className={`w-full xl:w-auto px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${isCompletedToday(habit.id) ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : `bg-${habit.color}-100 text-${habit.color}-700 hover:bg-${habit.color}-200 shadow-sm`}`}
                                            >
                                                {isCompletedToday(habit.id) ? <><FaTimes /> Batal</> : <><FaCheckCircle /> Selesai Hari Ini</>}
                                            </button>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex flex-col gap-6">

                    {/* 3️⃣ Habit Analytics Chart */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
                        <h3 className="mb-6 text-lg font-black text-slate-800">📈 Habit Consistency</h3>
                        <div className="w-full h-48">
                            {habits.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={habits.map(h => ({ name: h.title.split(' ')[0], Score: calculateStreak(h.id) }))}
                                        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                        <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="Score" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                            {habits.map((h, index) => {
                                                const colors: any = { blue: '#3B82F6', emerald: '#10B981', rose: '#F43F5E', amber: '#F59E0B', indigo: '#6366F1' };
                                                return <Cell key={`cell-${index}`} fill={colors[habits[index].color] || '#3B82F6'} />
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm font-bold tracking-widest uppercase text-slate-400">No Data</div>
                            )}
                        </div>
                    </div>

                    {/* 4️⃣ Insight & Motivasi */}
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 rounded-full pointer-events-none bg-white/10 blur-2xl translate-x-1/4"></div>
                        
                        <div className="relative z-10">
                            <h3 className="flex items-center gap-2 mb-4 text-sm font-black tracking-widest text-blue-100 uppercase"><FaQuoteLeft className="text-amber-400" /> Daily Insight</h3>
                            <p className="mb-6 text-sm italic font-medium leading-relaxed text-white/90">
                                "Satu langkah kecil setiap hari jauh lebih baik daripada satu lompatan besar yang hanya dilakukan sebulan sekali."
                            </p>

                            <div className="pt-5 border-t border-white/20">
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Pencapaian Terbaik Anda</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center justify-center w-10 h-10 text-lg border bg-white/20 rounded-xl text-amber-400 border-white/30"><FaTrophy /></div>
                                    <div>
                                        <h4 className="font-black text-white text-base truncate pr-2 max-w-[180px]">{bestHabit ? bestHabit.title : 'Belum Ada Habit'}</h4>
                                        <p className="text-xs font-bold text-blue-100">{longestStreak} Hari Berturut-turut!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 5️⃣ JEJAK REKAP BULANAN (Full Width Bawah) */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex flex-col justify-between gap-4 pb-6 mb-8 border-b sm:flex-row sm:items-center border-slate-50">
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-800"><FaHistory className="text-indigo-500" /> Arsip Jejak Bulanan</h3>
                    
                    {/* Controller Kalender History */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl shadow-sm">
                        <button onClick={handlePrevHistoryMonth} className="p-2 transition-colors bg-white border rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-100"><FaChevronLeft size={14} /></button>
                        <span className="text-sm font-black tracking-widest text-center uppercase text-slate-700 w-36">{monthNames[historyMonth]} {historyYear}</span>
                        <button onClick={handleNextHistoryMonth} disabled={isFutureHistoryMonth()} className={`p-2 rounded-lg transition-colors border ${isFutureHistoryMonth() ? 'bg-slate-50 text-slate-200 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600 hover:bg-indigo-50'}`}><FaChevronRight size={14} /></button>
                    </div>
                </div>

                {habits.length === 0 ? (
                    <p className="py-10 text-sm font-bold tracking-widest text-center uppercase text-slate-400">Belum ada habit yang diarsipkan.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {habits.map(habit => {
                            const completedThisHistoryMonth = historyMonthDays.filter(dateStr => isCompletedOnDate(habit.id, dateStr)).length;

                            return (
                                <div key={`history-${habit.id}`} className="p-6 transition-all border bg-slate-50 border-slate-200 rounded-3xl hover:border-indigo-300 hover:shadow-md">
                                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                                        <h4 className="pr-4 font-black truncate text-slate-700">{habit.title}</h4>
                                        <p className={`text-[10px] shrink-0 font-black text-${habit.color}-700 bg-${habit.color}-100 border border-${habit.color}-200 px-3 py-1.5 rounded-lg uppercase tracking-wider`}>
                                            {completedThisHistoryMonth} Selesai
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                        {historyMonthDays.map((dateStr, idx) => {
                                            const done = isCompletedOnDate(habit.id, dateStr);
                                            const dayNum = idx + 1; 
                                            return (
                                                <div
                                                    key={`hist-${dateStr}`}
                                                    title={`${dateStr} ${done ? '(Selesai)' : '(Terlewat)'}`}
                                                    className={`w-7 h-7 md:w-8 md:h-8 rounded-lg text-[10px] md:text-xs font-black flex items-center justify-center transition-colors cursor-help ${done ? `bg-${habit.color}-500 text-white shadow-md shadow-${habit.color}-500/20 scale-105` : 'bg-white border border-slate-200 text-slate-300 hover:bg-slate-100'}`}
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

        </div>
    );
};

export default Habits;