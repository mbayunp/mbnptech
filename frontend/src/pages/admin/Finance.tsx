// src/pages/admin/Finance.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaWallet, FaArrowDown, FaArrowUp, FaCreditCard, 
  FaFileExcel, FaFileCsv, FaSearch, FaFilter, 
  FaEdit, FaTrash, FaPlus
} from 'react-icons/fa';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const formatRp = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const Finance = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // State Data Master
  const [data, setData] = useState({
    summary: { balance: 0, monthIncome: 0, monthExpense: 0 },
    debt: { total_debt: 0, total_paid: 0, remaining_debt: 0 },
    transactions: [] as any[],
    barChart: [] as any[],
    pieChart: [] as any[]
  });

  // State Form Quick Add
  const [qaType, setQaType] = useState<'expense'|'income'>('expense');
  const [qaAmount, setQaAmount] = useState('');
  const [qaCategory, setQaCategory] = useState('');
  const [qaDate, setQaDate] = useState(new Date().toISOString().split('T')[0]);
  const [qaNote, setQaNote] = useState('');

  // State Form Debt
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDate, setDebtDate] = useState(new Date().toISOString().split('T')[0]);

  // --- FUNGSI AMBIL DATA DARI BACKEND ---
  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch('http://localhost:5000/api/finances/full-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [navigate]);

  // --- FUNGSI SUBMIT TRANSAKSI CEPAT ---
  const handleQuickAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!qaAmount || !qaCategory) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/finances/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          type: qaType, amount: parseInt(qaAmount.replace(/\D/g, '')), 
          category: qaCategory, date: qaDate, description: qaNote
        })
      });
      const result = await res.json();
      
      if (result.success) {
        Swal.fire({ icon: 'success', title: 'Tercatat!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        // Reset Form & Refresh Data
        setQaAmount(''); setQaCategory(''); setQaNote('');
        fetchFinanceData();
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal mencatat transaksi', 'error');
    }
  };

  // --- FUNGSI SUBMIT BAYAR HUTANG ---
  const handleDebtPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!debtAmount) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/finances/pay-debt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: parseInt(debtAmount.replace(/\D/g, '')), date: debtDate })
      });
      const result = await res.json();
      
      if (result.success) {
        Swal.fire({ icon: 'success', title: 'Hutang Terbayar!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        setDebtAmount('');
        fetchFinanceData();
      } else {
        Swal.fire('Info', result.message, 'info');
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal memproses pembayaran', 'error');
    }
  };

  if (isLoading) return <div className="flex h-full items-center justify-center p-20"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  const debtProgress = data.debt.total_debt > 0 
    ? Math.round((Number(data.debt.total_paid) / Number(data.debt.total_debt)) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola aset, pantau pengeluaran, dan targetkan kebebasan finansial.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-emerald-600 transition-all flex items-center gap-2 text-sm shadow-sm">
            <FaFileExcel className="text-emerald-600" /> Export Excel
          </button>
          <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center gap-2 text-sm shadow-sm">
            <FaFileCsv className="text-blue-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* 1️⃣ Finance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Saldo", amount: data.summary.balance, badge: "Keseluruhan", icon: <FaWallet />, color: "blue" },
          { title: "Pemasukan", amount: data.summary.monthIncome, badge: "Bulan Ini", icon: <FaArrowUp />, color: "emerald" },
          { title: "Pengeluaran", amount: data.summary.monthExpense, badge: "Bulan Ini", icon: <FaArrowDown />, color: "red" },
          { title: "Sisa Hutang", amount: data.debt.remaining_debt, badge: `Progress ${debtProgress}%`, icon: <FaCreditCard />, color: "orange" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</p>
              <h4 className="text-xl font-black text-slate-800">{formatRp(item.amount)}</h4>
              <p className={`text-[10px] font-bold text-${item.color}-500 mt-1 bg-${item.color}-50 px-2 py-0.5 rounded inline-block`}>{item.badge}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2️⃣ Quick Add Transaction */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
        <h3 className="text-lg font-black text-slate-800 mb-6 relative z-10">⚡ Quick Add Transaction</h3>
        
        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10 items-end">
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Jenis</label>
            <select value={qaType} onChange={(e) => setQaType(e.target.value as 'income'|'expense')} className={`w-full p-3 rounded-xl border-2 outline-none font-bold text-sm ${qaType === 'income' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <option value="expense">📉 Pengeluaran</option>
              <option value="income">📈 Pemasukan</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Jumlah (Rp)</label>
            <input type="text" inputMode="numeric" required value={qaAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setQaAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="0" className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-black text-slate-800" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Kategori</label>
            <input type="text" list="categories" required value={qaCategory} onChange={(e) => setQaCategory(e.target.value)} placeholder="Pilih/Ketik" className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium" />
            <datalist id="categories"><option value="Makanan"/><option value="Transport"/><option value="Operasional"/><option value="Project"/><option value="Lainnya"/></datalist>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Tanggal</label>
            <input type="date" required value={qaDate} onChange={(e) => setQaDate(e.target.value)} className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium text-slate-700" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Catatan</label>
            <input type="text" value={qaNote} onChange={(e) => setQaNote(e.target.value)} placeholder="Opsional..." className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm" />
          </div>
          <div className="lg:col-span-1">
            <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-sm">
              <FaPlus /> Tambah
            </button>
          </div>
        </form>
      </div>

      {/* 3️⃣ Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
            📊 Income vs Expense
            <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1">6 Bulan Terakhir</span>
          </h3>
          <div className="h-72 w-full">
            {data.barChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barChart} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `Rp${val/1000}k`} />
                  <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                  <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (<div className="w-full h-full flex items-center justify-center text-slate-400">Belum ada data.</div>)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-2">📈 Expense by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Distribusi pengeluaran bulan ini.</p>
          <div className="h-48 w-full relative">
            {data.pieChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieChart} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.pieChart.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (<div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">Tidak ada pengeluaran.</div>)}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 max-h-24 overflow-y-auto custom-scrollbar">
            {data.pieChart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600 truncate" title={item.name}>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4️⃣ Transaction Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-black text-slate-800">📋 Transaksi Terakhir</h3>
          <div className="flex gap-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input type="text" placeholder="Cari transaksi..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-all" />
            </div>
            <button className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100"><FaFilter className="text-sm" /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold rounded-tl-xl rounded-bl-xl">Tanggal</th>
                <th className="p-4 font-bold">Jenis</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Jumlah</th>
                <th className="p-4 font-bold">Catatan</th>
                <th className="p-4 font-bold text-center rounded-tr-xl rounded-br-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.transactions.length > 0 ? data.transactions.map((trx, idx) => {
                const dateObj = new Date(trx.date);
                const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('id-ID', { month: 'short' })}`;
                return (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{formattedDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-800 font-bold whitespace-nowrap">{trx.category}</td>
                  <td className={`p-4 font-black whitespace-nowrap ${trx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {trx.type === 'income' ? '+' : '-'} {formatRp(trx.amount)}
                  </td>
                  <td className="p-4 text-slate-500 max-w-[200px] truncate" title={trx.note}>{trx.note || '-'}</td>
                  <td className="p-4 flex justify-center gap-3 text-slate-400">
                    <button className="hover:text-blue-500 transition-colors"><FaEdit /></button>
                    <button className="hover:text-red-500 transition-colors"><FaTrash /></button>
                  </td>
                </tr>
              )}) : (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada transaksi. Tambahkan data pertama Anda!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5️⃣ Debt Management & 6️⃣ Monthly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Debt Tracker */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FaCreditCard className="text-orange-500" /> Debt Management
              </h3>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Progress: {debtProgress}%</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Total Hutang Awal</span>
                <span className="font-bold text-slate-800">{formatRp(data.debt.total_debt)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Sudah Dibayar</span>
                <span className="font-bold text-emerald-500">{formatRp(data.debt.total_paid)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Sisa Hutang</span>
                <span className="font-black text-red-500 text-xl">{formatRp(data.debt.remaining_debt)}</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-6 relative">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${debtProgress}%` }}>
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleDebtPayment} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Catat Pembayaran Baru</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" inputMode="numeric" required value={debtAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setDebtAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="Jumlah (Rp)" className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold focus:border-orange-400" />
              <input type="date" required value={debtDate} onChange={(e) => setDebtDate(e.target.value)} className="w-32 p-2.5 rounded-lg border border-slate-200 outline-none text-sm text-slate-600 focus:border-orange-400" />
              <button type="submit" disabled={Number(data.debt.remaining_debt) <= 0} className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white p-2.5 rounded-lg font-bold transition-all shadow-md shadow-orange-500/20 px-6">
                Bayar
              </button>
            </div>
          </form>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">📅 Monthly Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-3 font-bold rounded-tl-lg rounded-bl-lg">Bulan</th>
                  <th className="p-3 font-bold">Income</th>
                  <th className="p-3 font-bold">Expense</th>
                  <th className="p-3 font-bold rounded-tr-lg rounded-br-lg text-right">Selisih</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[...data.barChart].reverse().map((row, idx) => {
                  const diff = row.Income - row.Expense;
                  return (
                    <tr key={idx} className="border-b border-slate-50">
                      <td className="p-3 font-bold text-slate-700">{row.name}</td>
                      <td className="p-3 text-emerald-600 font-medium">{formatRp(row.Income)}</td>
                      <td className="p-3 text-red-500 font-medium">{formatRp(row.Expense)}</td>
                      <td className={`p-3 font-black text-right ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {diff >= 0 ? '+' : ''}{formatRp(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Finance;