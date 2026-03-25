// src/pages/admin/Activity.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import {
  FaHistory, FaFilter, FaTrash, FaWallet, FaBullseye,
  FaCompass, FaListUl, FaTrophy, FaCog, FaCalendarDay,
  FaChartBar, FaSearch, FaMosque, FaEnvelope
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';

interface ActivityLog {
  id: number;
  module: string;
  action: string;
  title: string;
  description: string;
  data: string | null;
  created_at: string;
}

const Activity = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, activeModule: '-' });
  const [chartData, setChartData] = useState<any[]>([]);

  // Filter States
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const queryParams = new URLSearchParams();
      if (filterModule !== 'all') queryParams.append('module', filterModule);
      if (filterAction !== 'all') queryParams.append('action', filterAction);
      if (filterDate !== 'all') queryParams.append('filterDate', filterDate);

      const res = await fetch(`${API_URL}/api/activities?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setLogs(result.data.logs);
        setStats(result.data.stats);

        const formattedChart = result.data.chartData.map((item: any) => ({
          name: item.module.charAt(0).toUpperCase() + item.module.slice(1).replace('_', ' '),
          count: item.count
        }));
        setChartData(formattedChart);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterModule, filterAction, filterDate]);

  const handleClearLogs = async () => {
    const result = await Swal.fire({
      title: 'Bersihkan Riwayat?',
      text: "Semua catatan aktivitas akan dihapus permanen.",
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/activities/clear`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchActivities();
      Swal.fire('Dibersihkan!', 'Riwayat kosong.', 'success');
    }
  };

  // ========================================================
  // FUNGSI BARU: MENGHAPUS LOG SECARA SPESIFIK (SATU PER SATU)
  // ========================================================
  const handleDeleteSingleLog = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Mencegah modal detail terbuka saat kita nge-klik icon hapus
    
    const result = await Swal.fire({
      title: 'Hapus Log Ini?',
      text: "Catatan ini akan dihilangkan dari riwayat.",
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/activities/${id}`, { 
          method: 'DELETE', 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Log dihapus', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
          fetchActivities(); // Refresh data
        } else {
          Swal.fire('Gagal', 'Terjadi kesalahan di server', 'error');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const showDetailModal = (log: ActivityLog) => {
    const config = getModuleConfig(log.module);
    
    let dataHtml = '';
    if (log.data) {
      try {
        const parsed = JSON.parse(log.data);
        dataHtml = `<div class="overflow-x-auto font-mono text-xs text-left border p-4 mt-4 bg-slate-50 rounded-xl border-slate-200"><pre>${JSON.stringify(parsed, null, 2)}</pre></div>`;
      } catch (e) { dataHtml = ''; }
    }

    Swal.fire({
      html: `
        <div class="flex flex-col items-center font-sans text-center">
          <div class="w-16 h-16 bg-${config.color}-50 text-${config.color}-500 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-${config.color}-100">
            ${config.iconHtml}
          </div>
          <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-full tracking-widest mb-3 border border-slate-200">${log.module.replace('_', ' ')} • ${log.action}</span>
          <h3 class="mb-2 text-xl font-black text-slate-900">${log.title}</h3>
          <p class="text-sm font-medium leading-relaxed text-slate-500">${log.description}</p>
          <div class="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-1 uppercase tracking-tighter">
            <i class="fa fa-clock"></i> ${new Date(log.created_at).toLocaleString('id-ID')}
          </div>
          ${dataHtml}
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Selesai',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[2.5rem] p-8' }
    });
  };

  const getModuleConfig = (module: string) => {
    switch (module) {
      case 'finance': return { icon: <FaWallet />, iconHtml: '💰', color: 'emerald' };
      case 'todo': return { icon: <FaListUl />, iconHtml: '✅', color: 'blue' };
      case 'goals': return { icon: <FaBullseye />, iconHtml: '🎯', color: 'amber' };
      case 'life_planning': return { icon: <FaCompass />, iconHtml: '🧭', color: 'indigo' };
      case 'habits': return { icon: <FaListUl />, iconHtml: '🔥', color: 'orange' };
      case 'achievements': return { icon: <FaTrophy />, iconHtml: '🏆', color: 'fuchsia' };
      case 'spiritual': return { icon: <FaMosque />, iconHtml: '🕌', color: 'teal' };
      case 'inquiry': return { icon: <FaEnvelope />, iconHtml: '📩', color: 'rose' };
      case 'system': return { icon: <FaCog />, iconHtml: '⚙️', color: 'slate' };
      default: return { icon: <FaHistory />, iconHtml: '📌', color: 'slate' };
    }
  };

  const groupLogsByDate = () => {
    const groups: { [key: string]: ActivityLog[] } = {};
    logs.forEach(log => {
      const dateObj = new Date(log.created_at);
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

      let dateKey = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      if (dateObj.toDateString() === today.toDateString()) dateKey = "Hari Ini";
      else if (dateObj.toDateString() === yesterday.toDateString()) dateKey = "Kemarin";

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });
    return groups;
  };

  const groupedLogs = groupLogsByDate();

  return (
    <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900">
            <FaHistory className="text-blue-600" /> Activity Center
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Audit sistem dan riwayat jejak digital Anda.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all bg-white border shadow-sm border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"><FaFilter /> Export Data</button>
          <button onClick={handleClearLogs} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 transition-all bg-red-50 rounded-xl hover:bg-red-100"><FaTrash /> Clear History</button>
        </div>
      </div>

      {/* 1️⃣ Summary Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[
          { title: "Total Logs", val: stats.total, icon: <FaChartBar />, color: "blue" },
          { title: "Today", val: stats.today, icon: <FaCalendarDay />, color: "emerald" },
          { title: "This Week", val: stats.week, icon: <FaHistory />, color: "amber" },
          { title: "Top Module", val: stats.activeModule.toUpperCase(), icon: <FaSearch />, color: "indigo", isText: true },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
              <h4 className={`font-black text-slate-800 truncate ${item.isText ? 'text-sm' : 'text-2xl'}`}>{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Kolom Kiri: Timeline */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* 2️⃣ Filter Bar */}
          <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap gap-3">
            <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 cursor-pointer">
              <option value="all">Semua Modul</option>
              <option value="finance">💰 Finance</option>
              <option value="todo">✅ Todo</option>
              <option value="goals">🎯 Goals</option>
              <option value="life_planning">🧭 Life Plan</option>
              <option value="habits">🔥 Habits</option>
              <option value="achievements">🏆 Achievements</option>
              <option value="spiritual">🕌 Spiritual</option>
              <option value="inquiry">📩 Inquiry Leads</option>
              <option value="system">⚙️ System</option>
            </select>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 cursor-pointer">
              <option value="all">Semua Aksi</option>
              <option value="create">Create (Buat)</option>
              <option value="update">Update (Edit)</option>
              <option value="delete">Delete (Hapus)</option>
              <option value="complete">Complete (Selesai)</option>
              <option value="login">Login</option>
            </select>
            <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl px-4 py-2.5 outline-none focus:border-blue-400 cursor-pointer">
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          {/* 3️⃣ Activity Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div></div>
            ) : Object.keys(groupedLogs).length === 0 ? (
              <div className="py-24 text-center text-slate-400">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl rounded-full bg-slate-50 text-slate-200"><FaHistory /></div>
                <p className="text-sm font-bold">Tidak ada aktivitas ditemukan.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.keys(groupedLogs).map((date) => (
                  <div key={date}>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100">{date}</h4>
                    <div className="relative pb-2 ml-4 space-y-6 border-l-2 border-slate-100">

                      {groupedLogs[date].map((log) => {
                        const config = getModuleConfig(log.module);
                        const timeString = new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                        return (
                          <div key={log.id} onClick={() => showDetailModal(log)} className="relative pl-10 cursor-pointer group">
                            {/* Node Icon */}
                            <div className={`absolute -left-[19px] top-1 w-9 h-9 bg-white border-2 border-${config.color}-400 text-${config.color}-500 rounded-xl flex items-center justify-center text-sm shadow-sm group-hover:scale-110 group-hover:bg-${config.color}-500 group-hover:text-white transition-all duration-300 z-10`}>
                              {config.icon}
                            </div>

                            {/* Content Card */}
                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] group-hover:shadow-lg group-hover:bg-white group-hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
                              <div className={`absolute left-0 top-0 h-full w-1 bg-${config.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                              
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-sm font-bold transition-colors text-slate-800 md:text-base group-hover:text-blue-600">{log.title}</h5>
                                
                                {/* Waktu dan Tombol Hapus (Dipisahkan agar rapi) */}
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-500 shrink-0 mt-1 uppercase tracking-tighter">{timeString}</span>
                                  <button 
                                    onClick={(e) => handleDeleteSingleLog(e, log.id)} 
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Hapus aktivitas ini"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                              <p className="mb-4 text-xs italic font-medium leading-relaxed text-slate-500 line-clamp-2">"{log.description}"</p>

                              <div className="flex gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-${config.color}-100 text-${config.color}-700 border border-${config.color}-200/50`}>{log.module.replace('_', ' ')}</span>
                                <span className="text-[9px] font-black px-2.5 py-1 rounded-md bg-white text-slate-400 border border-slate-200 uppercase">{log.action}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Statistics */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-6">
            <h3 className="flex items-center gap-2 mb-6 text-lg font-black text-slate-800"><FaChartBar className="text-blue-600" /> Analitik Modul</h3>
            <div className="w-full h-72">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} width={80} />
                    <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#F43F5E', '#14B8A6', '#EC4899'][index % 7]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs font-bold tracking-widest uppercase text-slate-400">No Data Available</div>
              )}
            </div>
            
            <div className="pt-6 mt-8 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tips Admin</p>
              <div className="p-4 border border-blue-100 bg-blue-50 rounded-2xl">
                <p className="text-xs font-medium leading-relaxed text-blue-700">Gunakan filter modul untuk melihat riwayat spesifik seperti <strong>Inquiry</strong> untuk memantau pesan masuk dari klien.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Activity;