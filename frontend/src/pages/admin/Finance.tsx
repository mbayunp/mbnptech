// src/pages/admin/Finance.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaWallet, FaArrowDown, FaArrowUp, FaCreditCard, 
  FaFileExcel, FaSearch, FaFilter, 
  FaEdit, FaTrash, FaPlus, FaCalendarAlt
} from 'react-icons/fa';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const formatRp = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent === 0) return null;
  return (
    <text x={x} y={y} fill={PIE_COLORS[index % PIE_COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="11" fontWeight="900">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Finance = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [data, setData] = useState({
    summary: { balance: 0, monthIncome: 0, monthExpense: 0 },
    debts: [] as any[], // Array Hutang
    totalDebtRemaining: 0, // Total sisa semua hutang
    transactions: [] as any[],
    barChart: [] as any[],
    pieChart: [] as any[]
  });

  const [qaType, setQaType] = useState<'expense'|'income'>('expense');
  const [qaAmount, setQaAmount] = useState('');
  const [qaCategory, setQaCategory] = useState('');
  const [qaDate, setQaDate] = useState(new Date().toISOString().split('T')[0]);
  const [qaNote, setQaNote] = useState('');
  
  // Form Pembayaran Hutang
  const [payDebtId, setPayDebtId] = useState('');
  const [debtAmount, setDebtAmount] = useState('');

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch('http://localhost:5000/api/finances/full-stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (res.status === 401 || res.status === 403) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (result.success) setData(result.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchFinanceData(); }, [navigate]);

  // --- CRUD TRANSAKSI ---
  const handleQuickAdd = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/finances/quick', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type: qaType, amount: parseInt(qaAmount.replace(/\D/g, '')), category: qaCategory, date: qaDate, description: qaNote })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Tercatat!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        setQaAmount(''); setQaCategory(''); setQaNote(''); fetchFinanceData();
      }
    } catch (err) { Swal.fire('Error', 'Gagal mencatat transaksi', 'error'); }
  };

  const handleDeleteTransaction = async (id: number) => {
    const result = await Swal.fire({ title: 'Hapus Transaksi?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/finances/transaction/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchFinanceData();
    }
  };

  const handleEditTransaction = async (trx: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Transaksi',
      html: `
        <select id="swal-type" class="w-full p-3 mb-3 border rounded-lg outline-none"><option value="expense" ${trx.type==='expense'?'selected':''}>Pengeluaran</option><option value="income" ${trx.type==='income'?'selected':''}>Pemasukan</option></select>
        <input id="swal-amount" type="number" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Jumlah" value="${trx.amount}">
        <input id="swal-category" type="text" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Kategori" value="${trx.category}">
        <input id="swal-date" type="date" class="w-full p-3 mb-3 border rounded-lg outline-none" value="${trx.date.split('T')[0]}">
        <input id="swal-desc" type="text" class="w-full p-3 border rounded-lg outline-none" placeholder="Catatan" value="${trx.note || ''}">
      `,
      focusConfirm: false, showCancelButton: true,
      preConfirm: () => ({
        type: (document.getElementById('swal-type') as HTMLSelectElement).value,
        amount: parseInt((document.getElementById('swal-amount') as HTMLInputElement).value),
        category: (document.getElementById('swal-category') as HTMLInputElement).value,
        date: (document.getElementById('swal-date') as HTMLInputElement).value,
        description: (document.getElementById('swal-desc') as HTMLInputElement).value
      })
    });
    if (formValues) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/finances/transaction/${trx.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues) });
      Swal.fire('Berhasil', 'Transaksi telah diperbarui', 'success'); fetchFinanceData();
    }
  };

  // --- CRUD MULTI-HUTANG ---
  const handleAddDebt = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Hutang Baru',
      html: `
        <input id="debt-name" type="text" class="w-full p-3 mb-3 border rounded-lg" placeholder="Nama Hutang (misal: Kartu Kredit)">
        <input id="debt-amount" type="number" class="w-full p-3 mb-3 border rounded-lg" placeholder="Total Hutang (Rp)">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target Lunas</label>
        <input id="debt-date" type="date" class="w-full p-3 border rounded-lg">
      `,
      showCancelButton: true,
      preConfirm: () => ({
        name: (document.getElementById('debt-name') as HTMLInputElement).value,
        totalAmount: parseInt((document.getElementById('debt-amount') as HTMLInputElement).value),
        dueDate: (document.getElementById('debt-date') as HTMLInputElement).value || null
      })
    });

    if (formValues && formValues.name && formValues.totalAmount) {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/finances/debt', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues) });
      fetchFinanceData(); Swal.fire('Berhasil', 'Hutang ditambahkan', 'success');
    }
  };

  const handleEditDebt = async (debt: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Hutang',
      html: `
        <input id="debt-name" type="text" class="w-full p-3 mb-3 border rounded-lg" value="${debt.name}">
        <input id="debt-amount" type="number" class="w-full p-3 mb-3 border rounded-lg" value="${debt.total_debt}">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target Lunas</label>
        <input id="debt-date" type="date" class="w-full p-3 border rounded-lg" value="${debt.due_date ? debt.due_date.split('T')[0] : ''}">
      `,
      showCancelButton: true,
      preConfirm: () => ({
        name: (document.getElementById('debt-name') as HTMLInputElement).value,
        newTotalAmount: parseInt((document.getElementById('debt-amount') as HTMLInputElement).value),
        dueDate: (document.getElementById('debt-date') as HTMLInputElement).value || null
      })
    });
    if (formValues) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/finances/debt/${debt.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues) });
      fetchFinanceData(); Swal.fire('Berhasil', 'Hutang diperbarui', 'success');
    }
  };

  const handleDeleteDebt = async (id: number) => {
    const result = await Swal.fire({ title: 'Hapus Hutang?', text: "Data ini akan hilang permanen.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/finances/debt/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchFinanceData();
    }
  };

  const handleDebtPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!debtAmount || !payDebtId) return;
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/finances/pay-debt', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ debtId: payDebtId, amount: parseInt(debtAmount.replace(/\D/g, '')) })
      });
      Swal.fire({ icon: 'success', title: 'Cicilan Dibayar!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      setDebtAmount(''); setPayDebtId(''); fetchFinanceData();
    } catch (err) { Swal.fire('Error', 'Gagal memproses pembayaran', 'error'); }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola aset, pantau pengeluaran, dan targetkan kebebasan finansial.</p>
        </div>
      </div>

      {/* 1️⃣ Summary Cards (Total Hutang menyesuaikan semua hutang) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Saldo", amount: data.summary.balance, badge: "Keseluruhan", icon: <FaWallet />, color: "blue" },
          { title: "Pemasukan", amount: data.summary.monthIncome, badge: "Bulan Ini", icon: <FaArrowUp />, color: "emerald" },
          { title: "Pengeluaran", amount: data.summary.monthExpense, badge: "Bulan Ini", icon: <FaArrowDown />, color: "red" },
          { title: "Total Hutang Berjalan", amount: data.totalDebtRemaining, badge: `${data.debts.length} Hutang Aktif`, icon: <FaCreditCard />, color: "orange" },
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

      {/* 2️⃣ Quick Add Transaction (Tetap sama) */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <h3 className="text-lg font-black text-slate-800 mb-6 relative z-10">⚡ Quick Add Transaction</h3>
        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10 items-end">
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Jenis</label>
            <select value={qaType} onChange={(e) => setQaType(e.target.value as 'income'|'expense')} className={`w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none`}>
              <option value="expense">📉 Pengeluaran</option>
              <option value="income">📈 Pemasukan</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Jumlah (Rp)</label>
            <input type="text" inputMode="numeric" required value={qaAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setQaAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="0" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-black outline-none" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Kategori</label>
            <input type="text" list="categories" required value={qaCategory} onChange={(e) => setQaCategory(e.target.value)} placeholder="Pilih/Ketik" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Tanggal</label>
            <input type="date" required value={qaDate} onChange={(e) => setQaDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none" />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-2">Catatan</label>
            <input type="text" value={qaNote} onChange={(e) => setQaNote(e.target.value)} placeholder="Opsional" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" />
          </div>
          <div className="lg:col-span-1">
            <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex justify-center gap-2 text-sm"><FaPlus /> Simpan</button>
          </div>
        </form>
      </div>

      {/* 3️⃣ Charts & 4️⃣ Transaction Table... (Sama seperti sebelumnya) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex justify-between">📊 Income vs Expense</h3>
          <div className="h-72 w-full">
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
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 mb-1">📈 Kategori Pengeluaran</h3>
          <p className="text-xs text-slate-500 mb-6">Analisis biaya bulan ini.</p>
          <div className="h-56 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieChart} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" label={renderCustomizedLabel} labelLine={true}>
                    {data.pieChart.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatRp(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-black text-slate-800 mb-6">📋 Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold rounded-l-xl">Tanggal</th>
                <th className="p-4 font-bold">Jenis</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Jumlah</th>
                <th className="p-4 font-bold">Catatan</th>
                <th className="p-4 font-bold text-center rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.transactions.map((trx, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-slate-600 font-medium">{new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{trx.type}</span></td>
                  <td className="p-4 text-slate-800 font-bold">{trx.category}</td>
                  <td className={`p-4 font-black ${trx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>{trx.type === 'income' ? '+' : '-'} {formatRp(trx.amount)}</td>
                  <td className="p-4 text-slate-500">{trx.note || '-'}</td>
                  <td className="p-4 flex justify-center gap-3 text-slate-400">
                    <button onClick={() => handleEditTransaction(trx)} className="hover:text-blue-500"><FaEdit /></button>
                    <button onClick={() => handleDeleteTransaction(trx.id)} className="hover:text-red-500"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5️⃣ NEW: MULTI-DEBT MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FaCreditCard className="text-orange-500" /> Daftar Hutang
            </h3>
            <button onClick={handleAddDebt} className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-all flex items-center gap-1">
              <FaPlus /> Tambah
            </button>
          </div>

          {/* List Hutang Scrollable */}
          <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar space-y-4 mb-4">
            {data.debts.length === 0 ? (
              <div className="text-center text-slate-400 py-10 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl">Belum ada hutang. Aman! 🎉</div>
            ) : (
              data.debts.map(debt => {
                const progress = Math.round((Number(debt.total_paid) / Number(debt.total_debt)) * 100);
                return (
                  <div key={debt.id} className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800">{debt.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><FaCalendarAlt/> {debt.due_date ? new Date(debt.due_date).toLocaleDateString('id-ID') : '-'}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditDebt(debt)} className="text-blue-500 hover:text-blue-700 text-sm"><FaEdit/></button>
                        <button onClick={() => handleDeleteDebt(debt.id)} className="text-red-500 hover:text-red-700 text-sm"><FaTrash/></button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-600">Sisa: <span className="font-black text-red-500">{formatRp(debt.remaining_debt)}</span></span>
                      <span className="font-bold text-orange-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Form Pembayaran Dropdown */}
          <form onSubmit={handleDebtPayment} className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-auto">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Catat Pembayaran</h4>
            <div className="flex flex-col gap-3">
              <select value={payDebtId} onChange={(e) => setPayDebtId(e.target.value)} required className="w-full p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-medium bg-white">
                <option value="" disabled>Pilih hutang yang dibayar...</option>
                {data.debts.map(d => <option key={d.id} value={d.id}>{d.name} (Sisa: {formatRp(d.remaining_debt)})</option>)}
              </select>
              <div className="flex gap-2">
                <input type="text" inputMode="numeric" required value={debtAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setDebtAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="Rp Nominal Bayar" className="flex-1 p-2.5 rounded-lg border border-slate-200 outline-none text-sm font-bold" />
                <button type="submit" disabled={data.debts.length === 0} className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white px-6 rounded-lg font-bold shadow-md">Bayar</button>
              </div>
            </div>
          </form>
        </div>

        {/* 6️⃣ Monthly Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">📅 Rekapan Bulanan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-3 font-bold rounded-l-lg">Bulan</th>
                  <th className="p-3 font-bold">Income</th>
                  <th className="p-3 font-bold">Expense</th>
                  <th className="p-3 font-bold rounded-r-lg text-right">Selisih</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[...data.barChart].reverse().map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="p-3 font-bold text-slate-700">{row.name}</td>
                    <td className="p-3 text-emerald-600 font-medium">{formatRp(row.Income)}</td>
                    <td className="p-3 text-red-500 font-medium">{formatRp(row.Expense)}</td>
                    <td className={`p-3 font-black text-right ${row.Income - row.Expense >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {row.Income - row.Expense >= 0 ? '+' : ''}{formatRp(row.Income - row.Expense)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Finance;