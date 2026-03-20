// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaWallet, FaArrowDown, FaCheckCircle, FaFire, 
  FaCommentDots, FaClock, FaChartPie, FaMosque, FaTasks, 
  FaChevronRight, FaRocket, FaTrophy, FaCreditCard 
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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
        const res = await fetch('http://localhost:5000/api/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (isLoading || !data) return <div className="flex h-96 items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

  // Fungsi Helper untuk format IDR agar konsisten menggunakan titik
  const formatIDR = (val: any) => {
    return Number(val).toLocaleString('id-ID');
  };

  const cards = [
    { title: "Total Saldo", val: `Rp ${formatIDR(data.finance.balance)}`, icon: <FaWallet />, color: "blue" },
    { title: "Pengeluaran", val: `Rp ${formatIDR(data.finance.expense)}`, icon: <FaArrowDown />, color: "red" },
    { title: "Habits Hari Ini", val: data.productivity.habits_status, icon: <FaFire />, color: "orange" },
    { title: "Pesan Baru", val: `${data.unread_inquiry} Leads`, icon: <FaCommentDots />, color: "indigo" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 selection:bg-blue-100">
      
      {/* 1️⃣ Greeting & Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Osu, {userName}! 👋</h2>
          <p className="text-slate-500 font-medium mt-1">Ini adalah ringkasan progres hidup dan bisnis Anda.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Terakhir</p>
          <p className="text-sm font-black text-slate-800">{new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</p>
        </div>
      </div>

      {/* 2️⃣ Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-${card.color}-50 text-${card.color}-600`}>{card.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{card.title}</p>
              <h4 className="text-xl font-black text-slate-800">{card.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 3️⃣ Life Priority Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => navigate('/admin/planing')} className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center shadow-xl shadow-blue-500/20 cursor-pointer hover:scale-[1.01] transition-transform">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/10">🚀</div>
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Target Hidup Utama (Life Plan)</p>
              <h3 className="text-xl md:text-2xl font-black">{data.life_goal.title}</h3>
            </div>
          </div>
          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase text-blue-100">
              <span>Progress Capaian</span>
              <span>{data.life_goal.progress}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-white/10">
              <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${data.life_goal.progress}%` }}></div>
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/admin/achievements')} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mb-3">🏆</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Achievement Terakhir</p>
          <h4 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight">{data.latest_achievement}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 4️⃣ Financial Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2"><FaChartPie className="text-blue-500"/> Cashflow Analysis</h3>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sisa Hutang</p>
                  <p className="text-sm font-black text-rose-500 flex items-center gap-1">
                    <FaCreditCard size={10}/> Rp {formatIDR(data.finance.debt)}
                  </p>
               </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value) => formatIDR(value)}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold'}} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5️⃣ Today's Spiritual Widget */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div>
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-emerald-400"><FaMosque /> Spiritual Today</h3>
            <div className="space-y-4">
              {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((s) => (
                <div key={s} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-sm font-bold capitalize text-slate-300">{s}</span>
                  {data.spiritual[s] ? <FaCheckCircle className="text-emerald-400" /> : <div className="w-4 h-4 rounded-full border-2 border-white/20"></div>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/admin/spiritual')} className="mt-6 w-full py-4 bg-emerald-500 text-slate-900 font-black rounded-2xl text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">Update Progress</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 6️⃣ Task & Productivity */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><FaTasks className="text-indigo-500"/> Tasks Pending</h3>
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] text-center border border-indigo-100">
              <h4 className="text-5xl font-black text-indigo-600 mb-1">{data.productivity.pending_tasks}</h4>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tugas di Board</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/todo')} className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
            Kelola Pekerjaan <FaChevronRight size={10}/>
          </button>
        </div>

        {/* 7️⃣ Recent Activity Log */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><FaClock className="text-slate-400" /> Aktivitas Terbaru Sistem</h3>
          <div className="space-y-5">
            {data.recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-4 group cursor-pointer" onClick={() => navigate('/admin/activity')}>
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all group-hover:scale-110">
                  <FaClock size={14}/>
                </div>
                <div className="flex-1 border-b border-slate-50 pb-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-700 leading-snug">{log.title}</p>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{log.module}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{log.description} • {new Date(log.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/admin/activity')} className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Lihat Semua History Log →</button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;