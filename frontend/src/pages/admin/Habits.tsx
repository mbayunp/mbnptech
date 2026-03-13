// src/pages/admin/Habits.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaFire, FaCheckCircle, FaCalendarCheck,
    FaChartLine, FaPlus, FaTimes, FaTrophy, FaEdit, FaTrash
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

    const fetchHabits = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const res = await fetch('http://localhost:5000/api/life/habits', {
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
    }, [navigate]);

    // --- ENGINE LOGIC ---
    const getTodayString = () => {
        const today = new Date();
        today.setHours(today.getHours() + 7); // Adjust WIB
        return today.toISOString().split('T')[0];
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
            const dateStr = checkDate.toISOString().split('T')[0];
            const done = isCompletedOnDate(habitId, dateStr);

            if (done) {
                streak++;
            } else {
                if (i === 0) continue;
                break;
            }
        }
        return streak;
    };

    const getLast7DaysProgress = (habitId: number) => {
        const days = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                dayName: dayNames[d.getDay()],
                done: isCompletedOnDate(habitId, dateStr),
                isToday: i === 0
            });
        }
        return days;
    };

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

            await fetch('http://localhost:5000/api/life/habits/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ habit_id: habitId, log_date: todayStr })
            });
            fetchHabits();
        } catch (err) { console.error(err); }
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
                const res = await fetch('http://localhost:5000/api/life/habits', {
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
                const res = await fetch(`http://localhost:5000/api/life/habits/${habit.id}`, {
                    method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(result.value)
                });
                if (res.ok) { Swal.fire({ icon: 'success', title: 'Diperbarui!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchHabits(); }
            } catch (err) { Swal.fire('Error', 'Gagal update', 'error'); }
        } else if (result.isDenied) {
            const confirmDelete = await Swal.fire({ title: 'Hapus Habit?', text: "Data log juga akan terhapus.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
            if (confirmDelete.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:5000/api/life/habits/${habit.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                    if (res.ok) { Swal.fire({ icon: 'success', title: 'Dihapus!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchHabits(); }
                } catch (err) { Swal.fire('Error', 'Gagal hapus', 'error'); }
            }
        }
    };

    // --- STATISTIK GLOBAL ---
    const totalHabits = habits.length;
    const completedTodayCount = habits.filter(h => isCompletedToday(h.id)).length;

    let longestStreak = 0;
    habits.forEach(h => {
        const s = calculateStreak(h.id);
        if (s > longestStreak) longestStreak = s;
    });

    const totalLogsLast7Days = logs.filter(l => {
        const logD = new Date(l.log_date);
        const today = new Date();
        const diff = (today.getTime() - logD.getTime()) / (1000 * 3600 * 24);
        return diff <= 7;
    }).length;
    const target7Days = habits.reduce((acc, h) => acc + h.target_per_week, 0);
    const consistencyPercent = target7Days === 0 ? 0 : Math.min(100, Math.round((totalLogsLast7Days / target7Days) * 100));

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

    const heatMapDays = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
    });

    return (
        <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FaChartLine className="text-blue-600" /> Habit Tracker
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Pantau dan tingkatkan konsistensi kebiasaan harian Anda.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAddHabit} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                        <FaPlus /> Add Habit
                    </button>
                </div>
            </div>

            {/* 1️⃣ Habit Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { title: "Total Habits", val: totalHabits, icon: <FaCalendarCheck />, color: "blue" },
                    { title: "Completed Today", val: `${completedTodayCount} / ${totalHabits}`, icon: <FaCheckCircle />, color: "emerald" },
                    { title: "Longest Streak", val: `${longestStreak} Hari`, icon: <FaFire />, color: "rose" },
                    { title: "Weekly Consistency", val: `${consistencyPercent}%`, icon: <FaTrophy />, color: "amber" },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                            <h4 className="text-2xl font-black text-slate-800">{item.val}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* 2️⃣ Habit Streak Tracker & List (Kiri) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px]">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><FaFire className="text-rose-500" /> Weekly Streak Tracker</h3>

                        <div className="space-y-6">
                            {habits.length === 0 ? <p className="text-center text-slate-400 py-10 font-medium">Belum ada habit yang ditambahkan.</p> : habits.map(habit => {
                                const streak = calculateStreak(habit.id);
                                const weekProgress = getLast7DaysProgress(habit.id);

                                return (
                                    <div key={habit.id} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-shadow relative">

                                        {/* Tombol Edit/Delete Pojok Kanan Atas (Tampil saat hover di Desktop) */}
                                        <button onClick={() => handleEditHabit(habit)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FaEdit />
                                        </button>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className={`font-bold text-slate-800 text-lg group-hover:text-${habit.color}-600 transition-colors`}>{habit.title}</h4>
                                                <span className={`bg-${habit.color}-50 text-${habit.color}-600 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 border border-${habit.color}-100`}>
                                                    <FaFire /> {streak} Streak
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">Target: <strong className="text-slate-700">{habit.target_per_week}x / minggu</strong></p>
                                        </div>

                                        {/* Weekly Bubbles */}
                                        <div className="flex items-center gap-2 shrink-0 md:mr-8">
                                            {weekProgress.map((day, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <span className={`text-[9px] font-bold ${day.isToday ? 'text-blue-600' : 'text-slate-400'}`}>{day.dayName}</span>
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${day.done ? `bg-${habit.color}-500 text-white shadow-md shadow-${habit.color}-500/30` : 'bg-slate-200 text-transparent'}`}>
                                                        <FaCheckCircle />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Button (Mark Today) */}
                                        <div className="shrink-0">
                                            <button
                                                onClick={() => handleToggleToday(habit.id)}
                                                className={`w-full md:w-auto px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${isCompletedToday(habit.id) ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : `bg-${habit.color}-100 text-${habit.color}-700 hover:bg-${habit.color}-200 shadow-sm`}`}
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

                    {/* 3️⃣ Habit Contribution Graph (Github Style) */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><FaCalendarCheck className="text-emerald-500" /> 30 Days Activity</h3>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {habits.map(habit => (
                                <div key={habit.id} className="mb-4 last:mb-0">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{habit.title}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {heatMapDays.map(dateStr => {
                                            const done = isCompletedOnDate(habit.id, dateStr);
                                            return (
                                                <div
                                                    key={dateStr}
                                                    title={`${dateStr} ${done ? '(Done)' : '(Missed)'}`}
                                                    className={`w-[14px] h-[14px] rounded-[4px] transition-colors ${done ? `bg-${habit.color}-500` : 'bg-slate-200'}`}
                                                ></div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4️⃣ Habit Analytics Chart */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
                        <h3 className="text-lg font-black text-slate-800 mb-6">📈 Habit Consistency</h3>
                        <div className="h-48 w-full">
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
                                <div className="flex h-full items-center justify-center text-slate-400 text-sm">Belum ada data chart.</div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Habits;