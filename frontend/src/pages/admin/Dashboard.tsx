// src/pages/admin/Dashboard.tsx
import { 
  FaWallet, FaArrowDown, FaArrowUp, FaCreditCard, 
  FaPlus, FaCheckCircle, FaRegCircle, FaBriefcase, 
  FaCommentDots, FaClock, FaChartPie
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- WIDGET COMPONENTS ---

const DashboardOverview = () => {
  const cards = [
    { title: "Total Saldo", amount: "Rp 3.200.000", desc: "Saldo bulan ini", icon: <FaWallet />, color: "blue" },
    { title: "Pengeluaran", amount: "Rp 1.200.000", desc: "Bulan ini", icon: <FaArrowDown />, color: "red" },
    { title: "Pemasukan", amount: "Rp 2.400.000", desc: "Bulan ini", icon: <FaArrowUp />, color: "emerald" },
    { title: "Sisa Hutang", amount: "Rp 1.400.000", desc: "Total hutang", icon: <FaCreditCard />, color: "orange" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-${card.color}-50 text-${card.color}-600`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
            <h4 className="text-xl font-black text-slate-800">{card.amount}</h4>
            <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const FinancialChart = () => {
  const data = [
    { name: 'Jan', Income: 4000, Expense: 2400 },
    { name: 'Feb', Income: 3000, Expense: 1398 },
    { name: 'Mar', Income: 2000, Expense: 9800 },
    { name: 'Apr', Income: 2780, Expense: 3908 },
    { name: 'May', Income: 1890, Expense: 4800 },
    { name: 'Jun', Income: 2390, Expense: 3800 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
        Statistik Keuangan
        <select className="text-sm font-normal text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 outline-none">
          <option>6 Bulan Terakhir</option>
          <option>Tahun Ini</option>
        </select>
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
            <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
            <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
            <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DebtTracker = () => {
  const percent = 28; // (400k / 1.4m) * 100

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-6">Debt Tracker</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-sm">Total Hutang Awal</span>
            <span className="font-bold text-slate-800">Rp 1.400.000</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-sm">Sudah Dibayar</span>
            <span className="font-bold text-emerald-500">Rp 400.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium text-sm">Sisa Hutang</span>
            <span className="font-black text-red-500 text-lg">Rp 1.000.000</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
          <span>Progress Pelunasan</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-orange-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
        </div>
        <button className="w-full mt-6 py-3 bg-slate-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors border border-blue-100">
          + Catat Pembayaran
        </button>
      </div>
    </div>
  );
};

const TodoListWidget = () => {
  const todos = [
    { text: "Belajar React 1 jam", done: false, priority: "high" },
    { text: "Update Portfolio", done: false, priority: "medium" },
    { text: "Menabung 100rb", done: false, priority: "low" },
    { text: "Olahraga pagi", done: true, priority: "medium" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-800">Target Hari Ini</h3>
        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">1 / 4 Selesai</span>
      </div>
      
      <div className="space-y-3 mb-6">
        {todos.map((todo, idx) => (
          <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${todo.done ? 'bg-slate-50 border-transparent' : 'border-slate-100 hover:border-blue-200'} transition-colors cursor-pointer`}>
            {todo.done ? <FaCheckCircle className="text-emerald-500 text-lg shrink-0" /> : <FaRegCircle className="text-slate-300 text-lg shrink-0 hover:text-blue-400" />}
            <span className={`flex-1 text-sm font-medium ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{todo.text}</span>
            {!todo.done && (
              <span className={`w-2 h-2 rounded-full shrink-0 ${todo.priority === 'high' ? 'bg-red-500' : todo.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
            )}
          </div>
        ))}
      </div>
      <button className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <FaPlus /> Tambah Task
      </button>
    </div>
  );
};

const ProjectsWidget = () => {
  const projects = [
    { name: "Portal Garut Satu Data", status: "Published", color: "emerald" },
    { name: "UKBI Garut 2026", status: "Active", color: "blue" },
    { name: "Picme Studio", status: "Published", color: "emerald" },
    { name: "IMN Business Group", status: "Published", color: "emerald" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
      <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
        <FaBriefcase className="text-slate-400" /> Projects Overview
      </h3>
      <div className="space-y-4 flex-1">
        {projects.map((proj, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-sm font-bold text-slate-700">{proj.name}</span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-${proj.color}-100 text-${proj.color}-600`}>
              {proj.status}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
        Kelola Portfolio →
      </button>
    </div>
  );
};

const InquiryWidget = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
      <FaCommentDots className="text-slate-400" /> Pesan Masuk (Inquiry)
    </h3>
    <div className="space-y-4 mb-6">
      {/* Sample Message */}
      <div className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-bold text-slate-800">Andi (andi@email.com)</h4>
          <span className="text-xs font-medium text-slate-400">10 Menit lalu</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          Halo Mas Bayu, saya tertarik ingin membuat website company profile untuk bisnis konveksi saya. Kira-kira estimasinya berapa ya?
        </p>
      </div>
      <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 opacity-60">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-bold text-slate-800">Dinas XYZ</h4>
          <span className="text-xs font-medium text-slate-400">Kemarin</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-1">Tanya terkait maintenance sistem...</p>
      </div>
    </div>
    <button className="w-full py-2 text-blue-600 text-sm font-bold hover:underline">
      Lihat Semua Pesan
    </button>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
      <FaClock className="text-slate-400" /> Aktivitas Terbaru
    </h3>
    <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-4">
      
      <div className="relative pl-6">
        <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-red-100 border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        </div>
        <p className="text-sm text-slate-700">Menambahkan pengeluaran <span className="font-bold">Rp 50.000</span> (Kopi)</p>
        <p className="text-xs text-slate-400 mt-1">Hari ini, 08:30 WIB</p>
      </div>

      <div className="relative pl-6">
        <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        </div>
        <p className="text-sm text-slate-700">Menambahkan task <span className="font-bold">"Belajar React"</span></p>
        <p className="text-xs text-slate-400 mt-1">Kemarin, 20:15 WIB</p>
      </div>

      <div className="relative pl-6">
        <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        </div>
        <p className="text-sm text-slate-700">Status Project <span className="font-bold">Picme Studio</span> diubah menjadi Published</p>
        <p className="text-xs text-slate-400 mt-1">10 Maret 2026</p>
      </div>

    </div>
  </div>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
    <button className="p-4 bg-white border border-slate-200 border-dashed rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 font-bold text-sm">
      <FaWallet className="text-xl" /> + Transaksi
    </button>
    <button className="p-4 bg-white border border-slate-200 border-dashed rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center gap-2 font-bold text-sm">
      <FaCheckCircle className="text-xl" /> + Todo Task
    </button>
    <button className="p-4 bg-white border border-slate-200 border-dashed rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 font-bold text-sm">
      <FaBriefcase className="text-xl" /> + Project Baru
    </button>
    <button className="p-4 bg-slate-900 border border-slate-900 rounded-xl text-white hover:bg-slate-800 transition-all flex flex-col items-center justify-center gap-2 font-bold text-sm shadow-lg">
      <FaChartPie className="text-xl" /> Laporan Full
    </button>
  </div>
);

// --- MAIN PAGE COMPONENT ---

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800">Welcome back, Bayu! 👋</h2>
        <p className="text-slate-500 mt-1">Berikut adalah ringkasan aktivitas dan finansial Anda hari ini.</p>
      </div>

      <DashboardOverview />

      {/* Grid 1: Keuangan (Chart & Debt) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <FinancialChart />
        <DebtTracker />
      </div>

      {/* Grid 2: Produktivitas & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TodoListWidget />
        <ProjectsWidget />
      </div>

      {/* Grid 3: Komunikasi & Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InquiryWidget />
        <RecentActivity />
      </div>

      <QuickActions />

    </div>
  );
};

export default Dashboard;