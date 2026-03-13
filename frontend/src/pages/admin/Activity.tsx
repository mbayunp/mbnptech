// src/pages/admin/Activity.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaHistory, FaFilter, FaTrash, FaWallet, FaBullseye, 
  FaCompass, FaListUl, FaTrophy, FaCog, FaCalendarDay, 
  FaChartBar, FaSearch
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

      // Bangun query string untuk filter
      const queryParams = new URLSearchParams();
      if (filterModule !== 'all') queryParams.append('module', filterModule);
      if (filterAction !== 'all') queryParams.append('action', filterAction);
      if (filterDate !== 'all') queryParams.append('filterDate', filterDate);

      const res = await fetch(`http://localhost:5000/api/activities?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setLogs(result.data.logs);
        setStats(result.data.stats);
        
        // Format chart data
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
  }, [filterModule, filterAction, filterDate]); // Re-fetch saat filter berubah

  const handleClearLogs = async () => {
    const result = await Swal.fire({
      title: 'Bersihkan Riwayat?',
      text: "Semua catatan aktivitas akan dihapus permanen.",
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/activities/clear', { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
      fetchActivities();
      Swal.fire('Dibersihkan!', 'Riwayat kosong.', 'success');
    }
  };

  const showDetailModal = (log: ActivityLog) => {
    const icon = getModuleConfig(log.module).iconHtml;
    const color = getModuleConfig(log.module).color;
    
    let dataHtml = '';
    if (log.data) {
      try {
        const parsed = JSON.parse(log.data);
        dataHtml = `<div class="text-left bg-slate-50 p-4 rounded-xl mt-4 text-xs font-mono overflow-x-auto border border-slate-200"><pre>${JSON.stringify(parsed, null, 2)}</pre></div>`;
      } catch(e) { dataHtml = ''; }
    }

    Swal.fire({
      html: `
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-${color}-50 text-${color}-500 rounded-full flex items-center justify-center text-3xl mb-4 border border-${color}-100">
            ${icon}
          </div>
          <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-widest mb-3">${log.module} • ${log.action}</span>
          <h3 class="text-xl font-black text-slate-900 mb-2">${log.title}</h3>
          <p class="text-sm text-slate-500">${log.description}</p>
          <div class="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-1"><i class="fa fa-clock"></i> ${new Date(log.created_at).toLocaleString('id-ID')}</div>
          ${dataHtml}
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[2rem] p-6' }
    });
  };

  // Utility Konfigurasi Tampilan
  const getModuleConfig = (module: string) => {
    switch(module) {
      case 'finance': return { icon: <FaWallet/>, iconHtml: '💰', color: 'emerald' };
      case 'goals': return { icon: <FaBullseye/>, iconHtml: '🎯', color: 'amber' };
      case 'life_planning': return { icon: <FaCompass/>, iconHtml: '🧭', color: 'indigo' };
      case 'habits': return { icon: <FaListUl/>, iconHtml: '📈', color: 'blue' };
      case 'achievements': return { icon: <FaTrophy/>, iconHtml: '🏆', color: 'fuchsia' };
      case 'system': return { icon: <FaCog/>, iconHtml: '⚙️', color: 'slate' };
      default: return { icon: <FaHistory/>, iconHtml: '📌', color: 'slate' };
    }
  };

  // Grouping Logs by Date Helper
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FaHistory className="text-blue-600" /> Aktivitas Terbaru
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Riwayat semua pembaruan dan aktivitas di ekosistem Anda.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"><FaFilter /> Export Log</button>
          <button onClick={handleClearLogs} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all flex items-center gap-2"><FaTrash /> Clear Log</button>
        </div>
      </div>

      {/* 1️⃣ Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { title: "Total Aktivitas", val: stats.total, icon: <FaChartBar />, color: "blue" },
          { title: "Hari Ini", val: stats.today, icon: <FaCalendarDay />, color: "emerald" },
          { title: "Minggu Ini", val: stats.week, icon: <FaHistory />, color: "amber" },
          { title: "Modul Teraktif", val: stats.activeModule.toUpperCase(), icon: <FaSearch />, color: "indigo", isText: true },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
              <h4 className={`font-black text-slate-800 truncate ${item.isText ? 'text-lg' : 'text-2xl'}`}>{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Timeline & Filter */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 2️⃣ Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3">
            <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none focus:border-blue-400">
              <option value="all">Semua Modul</option>
              <option value="finance">Finance</option>
              <option value="goals">Goals</option>
              <option value="life_planning">Life Planning</option>
              <option value="habits">Habits</option>
              <option value="achievements">Achievements</option>
              <option value="system">System</option>
            </select>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none focus:border-blue-400">
              <option value="all">Semua Aksi</option>
              <option value="create">Create (Buat)</option>
              <option value="update">Update (Edit)</option>
              <option value="delete">Delete (Hapus)</option>
              <option value="complete">Complete (Selesai)</option>
              <option value="login">Login</option>
            </select>
            <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none focus:border-blue-400">
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          {/* 3️⃣ Activity Timeline */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-40"><div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div></div>
            ) : Object.keys(groupedLogs).length === 0 ? (
              <div className="text-center text-slate-400 py-20 font-medium">Tidak ada aktivitas ditemukan.</div>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedLogs).map((date) => (
                  <div key={date}>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 bg-slate-50 inline-block px-3 py-1 rounded-lg">{date}</h4>
                    <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pb-2">
                      
                      {groupedLogs[date].map((log) => {
                        const config = getModuleConfig(log.module);
                        const timeString = new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                        
                        return (
                          <div key={log.id} onClick={() => showDetailModal(log)} className="relative pl-8 cursor-pointer group">
                            {/* Node / Titik */}
                            <div className={`absolute -left-[17px] top-1 w-8 h-8 bg-white border-2 border-${config.color}-400 text-${config.color}-500 rounded-full flex items-center justify-center text-sm shadow-sm group-hover:scale-110 group-hover:bg-${config.color}-50 transition-all`}>
                              {config.icon}
                            </div>
                            
                            {/* Konten Activity */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl group-hover:shadow-md group-hover:border-blue-200 transition-all">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">{log.title}</h5>
                                <span className="text-[10px] font-bold text-slate-400 shrink-0 mt-1">{timeString}</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mb-3">{log.description}</p>
                              
                              <div className="flex gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-${config.color}-100 text-${config.color}-700`}>{log.module.replace('_', ' ')}</span>
                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">{log.action}</span>
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

        {/* Kolom Kanan: Chart */}
        <div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-6">
            <h3 className="text-lg font-black text-slate-800 mb-6">📈 Modul Teraktif</h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 'bold'}} width={90} />
                    <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E'][index % 5]} />
                      ))}
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

export default Activity;