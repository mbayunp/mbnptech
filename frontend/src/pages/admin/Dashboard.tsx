// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaWallet, FaCheckCircle, FaFire, FaClock, FaChartPie, 
  FaMosque, FaTasks, FaBullseye, FaBolt, FaExclamationTriangle, 
  FaPlus, FaPrayingHands, FaRegCircle, FaArrowRight
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { API_URL } from '../../config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUserName(JSON.parse(userStr).name.split(' ')[0]);

    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dashboard/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) return <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div></div>;

  const formatIDR = (val: any) => Number(val).toLocaleString('id-ID');

  // --- SMART ENGINE LOGIC --- //
  
  // 1. Hitung Rasio Spiritual (Sholat 5 Waktu)
  const sholatKeys = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const sholatDone = sholatKeys.filter(k => data.spiritual[k]).length;
  const spiritualScore = (sholatDone / 5) * 100;

  // 2. Hitung Rasio Habits
  const habitParts = data.productivity.habits_status.split(' / ');
  const habitCompleted = parseInt(habitParts[0]) || 0;
  const habitTotal = parseInt(habitParts[1]) || 0;
  const habitScore = habitTotal > 0 ? (habitCompleted / habitTotal) * 100 : 0;

  // 3. Hitung Rasio Goals
  const goalScore = data.life_goal?.progress || 0;

  // 4. Hitung Rasio Finance (Heuristik Stabilitas)
  const income = data.chartData[data.chartData.length - 1]?.Income || 0;
  const expense = data.finance.expense || 0;
  let financeScore = 50; // Default stabil
  if (data.finance.balance > 0 && expense < (income * 0.7)) financeScore = 90; // Sehat
  else if (data.finance.balance <= 0 || expense > income) financeScore = 30; // Warning

  const lifeScore = Math.round((financeScore * 0.3) + (habitScore * 0.25) + (spiritualScore * 0.25) + (goalScore * 0.2));

  const todayFocus = [];
  if (data.productivity.pending_tasks > 0) todayFocus.push(`Selesaikan ${data.productivity.pending_tasks} task prioritas di To-Do List.`);
  if (5 - sholatDone > 0) todayFocus.push(`Lengkapi ${5 - sholatDone} waktu ibadah wajib hari ini.`);
  if (habitTotal - habitCompleted > 0) todayFocus.push(`Tuntaskan ${habitTotal - habitCompleted} habit yang belum dicentang.`);
  if (todayFocus.length === 0) todayFocus.push('Semua target harian selesai. Anda luar biasa!');

  // 7. Generate Smart Insights
  const insights = [];
  if (financeScore < 50) insights.push({ text: "Pengeluaran mendekati batas pendapatan. Perketat budget Anda.", type: "warning" });
  else insights.push({ text: "Arus kas bulan ini sangat stabil.", type: "success" });
  
  if (spiritualScore === 100) insights.push({ text: "Ibadah wajib terpenuhi sempurna hari ini. MasyaAllah!", type: "success" });
  else if (spiritualScore === 0) insights.push({ text: "Belum ada catatan ibadah hari ini.", type: "warning" });

  if (habitScore < 50 && habitTotal > 0) insights.push({ text: "Progress habit menurun hari ini. Yuk dikejar!", type: "warning" });
  else if (habitScore >= 80) insights.push({ text: "Konsistensi habit sangat baik.", type: "success" });

  return (
    <div className="pb-12 mx-auto max-w-7xl selection:bg-blue-100">
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Osu, {userName}! 👋</h2>
          <p className="mt-1 font-medium text-slate-500">Sistem kendali hidup Anda siap diarahkan hari ini.</p>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Update Terakhir</p>
          <p className="text-sm font-black text-slate-800">{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</p>
        </div>
      </div>

      {/* =========================================
          SECTION 1: CORE CONTROL (LIFE SCORE & FOCUS) 
          ========================================= */}
      <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
        
        {/* LIFE SCORE (Kiri) */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden xl:col-span-2 flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-20 -mr-20 rounded-full pointer-events-none bg-blue-500/20 blur-3xl"></div>
          
          <div className="relative z-10 text-center shrink-0">
            <div className="relative flex flex-col items-center justify-center w-40 h-40 border-8 rounded-full border-blue-500/30">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#3B82F6" strokeWidth="8%" strokeDasharray="100 100" strokeDashoffset={`${100 - lifeScore}`} className="transition-all duration-1000 ease-out" pathLength="100"/>
              </svg>
              <span className="text-4xl font-black">{lifeScore}</span>
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Life Score</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 w-full space-y-5">
            <h3 className="mb-2 text-lg font-black">Life Balance Metrics</h3>
            {[
              { label: "Finance", val: financeScore, color: "bg-emerald-400" },
              { label: "Habits", val: habitScore, color: "bg-amber-400" },
              { label: "Spiritual", val: spiritualScore, color: "bg-teal-400" },
              { label: "Goals", val: goalScore, color: "bg-blue-400" },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-slate-300">
                  <span>{m.label}</span>
                  <span>{Math.round(m.val)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10">
                  <div className={`${m.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${m.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY FOCUS (Kanan) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="flex items-center gap-2 mb-6 text-lg font-black text-slate-800"><FaBullseye className="text-rose-500"/> Fokus Hari Ini</h3>
            <div className="space-y-4">
              {todayFocus.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaRegCircle className="text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-snug text-slate-700">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 2: QUICK ACTIONS & SMART INSIGHTS 
          ========================================= */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        
        {/* QUICK ACTIONS (Kiri - Horizontal Scroll on Mobile) */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-3 sm:grid-cols-4">
          <button onClick={() => navigate('/admin/finance')} className="p-5 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform rounded-full bg-emerald-50 text-emerald-500 group-hover:scale-110"><FaWallet /></div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600">Catat Uang</span>
          </button>
          <button onClick={() => navigate('/admin/habits')} className="p-5 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-lg hover:border-amber-200 transition-all flex flex-col items-center justify-center text-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform rounded-full bg-amber-50 text-amber-500 group-hover:scale-110"><FaFire /></div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-amber-600">Update Habit</span>
          </button>
          <button onClick={() => navigate('/admin/spiritual')} className="p-5 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-lg hover:border-teal-200 transition-all flex flex-col items-center justify-center text-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 text-xl text-teal-500 transition-transform rounded-full bg-teal-50 group-hover:scale-110"><FaPrayingHands /></div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-teal-600">Isi Ibadah</span>
          </button>
          <button onClick={() => navigate('/admin/todo')} className="p-5 bg-slate-900 text-white shadow-md rounded-[2rem] hover:bg-slate-800 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center gap-3 group border border-slate-800">
            <div className="flex items-center justify-center w-12 h-12 text-xl text-blue-400 transition-transform border rounded-full bg-white/10 group-hover:scale-110 border-white/5"><FaPlus /></div>
            <span className="text-xs font-bold text-slate-300">Tambah Task</span>
          </button>
        </div>

        {/* SMART INSIGHT (Kanan) */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[2.5rem] border border-indigo-100 shadow-sm flex flex-col justify-center">
          <h3 className="flex items-center gap-2 mb-4 text-sm font-black text-indigo-800"><FaBolt className="text-amber-500"/> Smart Insight</h3>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-2">
                {ins.type === 'warning' ? <FaExclamationTriangle className="text-rose-500 mt-0.5 shrink-0"/> : <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0"/>}
                <p className="text-xs font-medium text-slate-700">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          SECTION 3: ANALYTICS & RECENT LOGS 
          ========================================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* FINANCIAL CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800"><FaChartPie className="text-blue-500"/> Cashflow Insight</h3>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Saldo</p>
              <p className="text-lg font-black text-blue-600">Rp {formatIDR(data.finance.balance)}</p>
            </div>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} formatter={(value) => formatIDR(value)}/>
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold'}} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY LOG */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-lg font-black text-slate-800"><FaClock className="text-slate-400" /> Recent Log</h3>
            </div>
            <div className="space-y-4">
              {data.recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold leading-snug text-slate-700">{log.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/admin/activity')} className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-xs font-bold text-blue-600 transition-colors bg-slate-50 rounded-xl hover:bg-blue-100">
            Lihat Semua Aktivitas <FaArrowRight />
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;