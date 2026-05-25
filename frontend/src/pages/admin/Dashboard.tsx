// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Wallet, CheckCircle, Flame, Clock, PieChart, 
  Target, Zap, AlertTriangle, 
  Plus, Sparkles, Circle, ArrowRight, Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { API_URL } from '../../config/api';
import MagneticGlowCard from '../../components/MagneticGlowCard';
import ActivityHeatmap from '../../components/ActivityHeatmap';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUserName(JSON.parse(userStr).name.split(' ')[0]);

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const [summaryRes, heatmapRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/summary`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/dashboard/heatmap`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        const summaryResult = await summaryRes.json();
        const heatmapResult = await heatmapRes.json();
        if (summaryResult.success) setData(summaryResult.data);
        if (heatmapResult.success) setHeatmapData(heatmapResult.data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-500 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  const formatIDR = (val: any) => Number(val).toLocaleString('id-ID');

  // --- SMART ENGINE LOGIC --- //
  const sholatKeys = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const sholatDone = sholatKeys.filter(k => data.spiritual[k]).length;
  const spiritualScore = (sholatDone / 5) * 100;

  const habitParts = data.productivity.habits_status.split(' / ');
  const habitCompleted = parseInt(habitParts[0]) || 0;
  const habitTotal = parseInt(habitParts[1]) || 0;
  const habitScore = habitTotal > 0 ? (habitCompleted / habitTotal) * 100 : 0;

  const goalScore = data.life_goal?.progress || 0;

  const income = data.chartData[data.chartData.length - 1]?.Income || 0;
  const expense = data.finance.expense || 0;
  let financeScore = 50; 
  if (data.finance.balance > 0 && expense < (income * 0.7)) financeScore = 90; 
  else if (data.finance.balance <= 0 || expense > income) financeScore = 30; 

  const lifeScore = Math.round((financeScore * 0.3) + (habitScore * 0.25) + (spiritualScore * 0.25) + (goalScore * 0.2));

  const todayFocus = [];
  if (data.productivity.pending_tasks > 0) todayFocus.push(`Selesaikan ${data.productivity.pending_tasks} task prioritas di To-Do List.`);
  if (5 - sholatDone > 0) todayFocus.push(`Lengkapi ${5 - sholatDone} waktu ibadah wajib hari ini.`);
  if (habitTotal - habitCompleted > 0) todayFocus.push(`Tuntaskan ${habitTotal - habitCompleted} habit yang belum dicentang.`);
  if (todayFocus.length === 0) todayFocus.push('Semua target harian selesai. Anda luar biasa!');

  const insights = [];
  if (financeScore < 50) insights.push({ text: "Pengeluaran mendekati batas pendapatan. Perketat budget Anda.", type: "warning" });
  else insights.push({ text: "Arus kas bulan ini sangat stabil.", type: "success" });
  
  if (spiritualScore === 100) insights.push({ text: "Ibadah wajib terpenuhi sempurna hari ini. MasyaAllah!", type: "success" });
  else if (spiritualScore === 0) insights.push({ text: "Belum ada catatan ibadah hari ini.", type: "warning" });

  if (habitScore < 50 && habitTotal > 0) insights.push({ text: "Progress habit menurun hari ini. Yuk dikejar!", type: "warning" });
  else if (habitScore >= 80) insights.push({ text: "Konsistensi habit sangat baik.", type: "success" });

  // Custom Glass Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border border-slate-200/50 dark:border-white/[0.05] p-4 rounded-2xl shadow-xl">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5">{label}</p>
          <p className="text-xs font-extrabold text-emerald-500 flex justify-between gap-4">
            <span>Pemasukan:</span> <span>Rp {Number(payload[0].value).toLocaleString('id-ID')}</span>
          </p>
          <p className="text-xs font-extrabold text-rose-500 flex justify-between gap-4 mt-1">
            <span>Pengeluaran:</span> <span>Rp {Number(payload[1].value).toLocaleString('id-ID')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pb-12 mx-auto max-w-7xl"
    >
      <Helmet>
        <title>Dashboard Utama | MBNP System</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">Osu, {userName}! 👋</h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Sistem kendali hidup Anda siap diarahkan hari ini.</p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500">Update Terakhir</p>
          <p className="text-sm font-black text-slate-800 dark:text-slate-200">{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</p>
        </div>
      </div>

      {/* LIFE SCORE & FOCUS GRID */}
      <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
        
        {/* LIFE SCORE (Col 2) */}
        <div className="bg-gradient-to-br from-[#0B0F19] to-[#030712] p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden xl:col-span-2 flex flex-col md:flex-row gap-8 items-center border border-white/[0.05]">
          <div className="absolute top-0 right-0 w-80 h-80 -mt-20 -mr-20 rounded-full pointer-events-none bg-blue-500/10 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 -mb-20 -ml-20 rounded-full pointer-events-none bg-indigo-500/10 blur-[100px]"></div>
          
          <div className="relative z-10 text-center shrink-0">
            <div className="relative flex flex-col items-center justify-center w-40 h-40 rounded-full bg-slate-950/40 shadow-inner">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <circle cx="50%" cy="50%" r="43%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8%"/>
                <circle cx="50%" cy="50%" r="43%" fill="none" stroke="url(#scoreGrad)" strokeWidth="8%" strokeDasharray="100 100" strokeDashoffset={`${100 - lifeScore}`} className="transition-all duration-1000 ease-out" pathLength="100" strokeLinecap="round"/>
              </svg>
              <span className="text-5xl font-black tracking-tight text-white">{lifeScore}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Life Score</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 w-full space-y-4">
            <h3 className="mb-1 text-lg font-black font-display tracking-tight text-white">Life Balance Metrics</h3>
            {[
              { label: "Finance", val: financeScore, color: "bg-emerald-500" },
              { label: "Habits", val: habitScore, color: "bg-amber-500" },
              { label: "Spiritual", val: spiritualScore, color: "bg-teal-500" },
              { label: "Goals", val: goalScore, color: "bg-blue-500" },
            ].map(m => (
              <div key={m.label} className="group">
                <div className="flex justify-between text-[11px] font-black mb-1 uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                  <span>{m.label}</span>
                  <span>{Math.round(m.val)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.val}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`${m.color} h-full rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY FOCUS */}
        <div className="bg-white dark:bg-[#0B0F19] p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 mb-6 text-lg font-black text-slate-800 dark:text-white font-display"><Target className="text-rose-500" size={20} /> Fokus Hari Ini</h3>
            <div className="space-y-4">
              {todayFocus.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="relative flex h-3.5 w-3.5 shrink-0 mt-0.5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & AI INSIGHTS */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        
        {/* QUICK ACTIONS - Floating Cards */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-3 sm:grid-cols-4">
          <button 
            onClick={() => navigate('/admin/finance')} 
            className="p-6 bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Wallet size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Catat Uang</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/habits')} 
            className="p-6 bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <Flame size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Update Habit</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/spiritual')} 
            className="p-6 bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 group-hover:scale-110 transition-transform">
              <Sparkles size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Isi Ibadah</span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/todo')} 
            className="p-6 bg-white dark:bg-[#0B0F19] rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center gap-3 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Plus size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Tambah Task</span>
          </button>
        </div>

        {/* AI SMART INSIGHT */}
        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 p-6 rounded-[2rem] border border-blue-500/10 dark:border-blue-500/20 shadow-sm flex flex-col justify-center">
          <h3 className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400 font-display"><Zap className="text-amber-500 animate-pulse" size={16} /> Smart Insight</h3>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {ins.type === 'warning' ? (
                  <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={14} />
                ) : (
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                )}
                <p className="text-xs font-bold leading-relaxed text-slate-700 dark:text-slate-300">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVITY HEATMAP */}
      {heatmapData && heatmapData.activity && (
        <div className="mb-8">
          <ActivityHeatmap data={heatmapData.activity} type="activity" />
        </div>
      )}

      {/* ANALYTICS & LOGS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* FINANCIAL CHART */}
        <div className="bg-white dark:bg-[#0B0F19] p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white font-display"><PieChart className="text-blue-500" size={18} /> Cashflow Insight</h3>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Saldo</p>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">Rp {formatIDR(data.finance.balance)}</p>
            </div>
          </div>
          
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <defs>
                  <linearGradient id="pemasukanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.05)', radius: 8}} content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'extrabold'}} />
                <Bar name="Pemasukan" dataKey="Income" fill="url(#pemasukanGrad)" radius={[6, 6, 0, 0]} maxBarSize={30} />
                <Bar name="Pengeluaran" dataKey="Expense" fill="url(#pengeluaranGrad)" radius={[6, 6, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY LOG */}
        <div className="bg-white dark:bg-[#0B0F19] p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/[0.05] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white mb-6 font-display">
              <Clock className="text-slate-400" size={18} /> Recent Log
            </h3>
            <div className="space-y-4">
              {data.recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.02] last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 animate-pulse"></div>
                  <div>
                    <p className="text-xs font-bold leading-relaxed text-slate-800 dark:text-slate-200">{log.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/admin/activity')} 
            className="flex items-center justify-center w-full gap-2 py-3 mt-6 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors bg-slate-50 dark:bg-white/[0.02] hover:bg-blue-50 dark:hover:bg-white/[0.05] rounded-xl border border-slate-100 dark:border-white/[0.03]"
          >
            Lihat Semua Aktivitas <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;