// src/pages/admin/Finance.tsx
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaWallet, FaArrowDown, FaArrowUp, FaCreditCard,
  FaEdit, FaTrash, FaPlus, FaCalendarAlt, FaShieldAlt,
  FaHistory, FaChartLine
} from 'react-icons/fa';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { API_URL } from '../../config/api';

const formatRp = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }: any) => {
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

// DATA KATEGORI & SUMBER UANG
const INCOME_CATEGORIES = ["Gaji", "Projek", "Pinjaman", "Lainnya"];
const EXPENSE_CATEGORIES = ["Kosan", "Motor", "Melunasi Hutang", "Makan & Minum", "Sedekah", "Memberi", "Jajan", "Barang", "Laundry", "Lainnya"];
const SOURCES = ["Bank BJB", "Digicash", "Bank BSI 1", "Bank BSI 2", "Dana", "Cash/Dompet", "Gopay", "Shopeepay"];

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

  // State Form Transaksi
  const [qaType, setQaType] = useState<'expense' | 'income'>('expense');
  const [qaSource, setQaSource] = useState(SOURCES[5]); // Default Cash/Dompet
  const [qaAmount, setQaAmount] = useState('');
  const [qaCategory, setQaCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [qaDate, setQaDate] = useState(new Date().toISOString().split('T')[0]);
  const [qaNote, setQaNote] = useState('');

  // State Debt Strategy
  const [payDebtId, setPayDebtId] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  
  // Menggunakan string agar bisa diformat dengan titik (contoh: 500.000)
  const [monthlyCommitmentStr, setMonthlyCommitmentStr] = useState('500.000');
  const monthlyCommitment = parseInt(monthlyCommitmentStr.replace(/\D/g, '')) || 0;

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch(`${API_URL}/api/finances/full-stats`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (res.status === 401 || res.status === 403) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (result.success) setData(result.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchFinanceData(); }, [navigate]);

  // Efek mengubah default kategori saat jenis transaksi berubah
  useEffect(() => {
    if (qaType === 'income') setQaCategory(INCOME_CATEGORIES[0]);
    else setQaCategory(EXPENSE_CATEGORIES[0]);
  }, [qaType]);

  // --- CRUD TRANSAKSI ---
  const handleQuickAdd = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/finances/quick`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type: qaType, source: qaSource, amount: parseInt(qaAmount.replace(/\D/g, '')), category: qaCategory, date: qaDate, description: qaNote })
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Tercatat!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        setQaAmount(''); setQaNote(''); fetchFinanceData();
      }
    } catch (err) { Swal.fire('Error', 'Gagal mencatat transaksi', 'error'); }
  };

  const handleDeleteTransaction = async (id: number) => {
    const result = await Swal.fire({ title: 'Hapus Transaksi?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/transaction/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchFinanceData();
    }
  };

  const handleEditTransaction = async (trx: any) => {
    const categoryOptions = trx.type === 'income' 
      ? INCOME_CATEGORIES.map(c => `<option value="${c}" ${trx.category === c ? 'selected' : ''}>${c}</option>`).join('')
      : EXPENSE_CATEGORIES.map(c => `<option value="${c}" ${trx.category === c ? 'selected' : ''}>${c}</option>`).join('');

    const sourceOptions = SOURCES.map(s => `<option value="${s}" ${trx.source === s ? 'selected' : ''}>${s}</option>`).join('');

    // Format nilai awal ke bentuk ribuan titik (contoh: 100000 menjadi "100.000")
    const initialFormattedAmount = new Intl.NumberFormat('id-ID').format(trx.amount);

    const { value: formValues } = await Swal.fire({
      title: 'Edit Transaksi',
      html: `
        <select id="swal-type" class="w-full p-3 mb-3 border rounded-lg outline-none" disabled>
          <option value="expense" ${trx.type === 'expense' ? 'selected' : ''}>Pengeluaran</option>
          <option value="income" ${trx.type === 'income' ? 'selected' : ''}>Pemasukan</option>
        </select>
        <select id="swal-source" class="w-full p-3 mb-3 border rounded-lg outline-none">
          ${sourceOptions}
        </select>
        <input 
          id="swal-amount" 
          type="text" 
          inputmode="numeric"
          class="w-full p-3 mb-3 border rounded-lg outline-none font-bold text-slate-800" 
          placeholder="Jumlah (Rp)" 
          value="${initialFormattedAmount}"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value) this.value = new Intl.NumberFormat('id-ID').format(this.value);"
        >
        <select id="swal-category" class="w-full p-3 mb-3 border rounded-lg outline-none">
          ${categoryOptions}
        </select>
        <input id="swal-date" type="date" class="w-full p-3 mb-3 border rounded-lg outline-none text-slate-600" value="${trx.date.split('T')[0]}">
        <input id="swal-desc" type="text" class="w-full p-3 border rounded-lg outline-none text-slate-600" placeholder="Catatan" value="${trx.note || ''}">
      `,
      focusConfirm: false, 
      showCancelButton: true,
      preConfirm: () => {
        const rawAmountStr = (document.getElementById('swal-amount') as HTMLInputElement).value;
        const cleanAmount = parseInt(rawAmountStr.replace(/\D/g, ''), 10) || 0;

        return {
          type: trx.type,
          source: (document.getElementById('swal-source') as HTMLSelectElement).value,
          amount: cleanAmount,
          category: (document.getElementById('swal-category') as HTMLSelectElement).value,
          date: (document.getElementById('swal-date') as HTMLInputElement).value,
          description: (document.getElementById('swal-desc') as HTMLInputElement).value
        };
      }
    });

    if (formValues) {
      if (formValues.amount <= 0) {
         Swal.fire('Error', 'Nominal tidak boleh nol', 'error');
         return;
      }

      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/transaction/${trx.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify(formValues) 
      });
      Swal.fire('Berhasil', 'Transaksi telah diperbarui', 'success'); 
      fetchFinanceData();
    }
  };

  // --- CRUD MULTI-HUTANG ---
  const handleAddDebt = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Hutang Baru',
      html: `
        <input id="debt-name" type="text" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Hutang (misal: Kartu Kredit)">
        <input 
          id="debt-amount" 
          type="text" 
          inputmode="numeric"
          class="w-full p-3 mb-3 border rounded-lg outline-none font-bold text-slate-800" 
          placeholder="Total Hutang (Rp)"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value) this.value = new Intl.NumberFormat('id-ID').format(this.value);"
        >
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target Lunas (Opsional)</label>
        <input id="debt-date" type="date" class="w-full p-3 border rounded-lg outline-none text-slate-600">
      `,
      showCancelButton: true,
      preConfirm: () => {
        const rawAmountStr = (document.getElementById('debt-amount') as HTMLInputElement).value;
        const cleanAmount = parseInt(rawAmountStr.replace(/\D/g, ''), 10) || 0;
        
        return {
          name: (document.getElementById('debt-name') as HTMLInputElement).value,
          totalAmount: cleanAmount,
          dueDate: (document.getElementById('debt-date') as HTMLInputElement).value || null
        }
      }
    });

    if (formValues && formValues.name && formValues.totalAmount > 0) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/debt`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues) });
      fetchFinanceData(); Swal.fire('Berhasil', 'Hutang ditambahkan', 'success');
    }
  };

  const handleEditDebt = async (debt: any) => {
    // Format angka ke titik sebelum dimasukkan ke form
    const initialAmount = new Intl.NumberFormat('id-ID').format(debt.total_debt);

    const { value: formValues } = await Swal.fire({
      title: 'Edit Hutang',
      html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Nama Hutang</label>
        <input id="debt-name" type="text" class="w-full p-3 mb-3 border rounded-lg outline-none" value="${debt.name}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Total Hutang Keseluruhan (Rp)</label>
        <input 
          id="debt-amount" 
          type="text" 
          inputmode="numeric"
          class="w-full p-3 mb-3 border rounded-lg outline-none font-bold text-slate-800" 
          value="${initialAmount}"
          oninput="this.value = this.value.replace(/[^0-9]/g, ''); if(this.value) this.value = new Intl.NumberFormat('id-ID').format(this.value);"
        >
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Target Lunas</label>
        <input id="debt-date" type="date" class="w-full p-3 border rounded-lg outline-none text-slate-600" value="${debt.due_date ? debt.due_date.split('T')[0] : ''}">
      `,
      showCancelButton: true,
      preConfirm: () => {
        const rawAmountStr = (document.getElementById('debt-amount') as HTMLInputElement).value;
        const cleanAmount = parseInt(rawAmountStr.replace(/\D/g, ''), 10) || 0;

        return {
          name: (document.getElementById('debt-name') as HTMLInputElement).value,
          newTotalAmount: cleanAmount,
          dueDate: (document.getElementById('debt-date') as HTMLInputElement).value || null
        }
      }
    });
    
    if (formValues) {
      if (formValues.newTotalAmount <= 0) return Swal.fire('Error', 'Nominal hutang tidak valid', 'error');

      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/debt/${debt.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues) });
      fetchFinanceData(); Swal.fire('Berhasil', 'Hutang diperbarui', 'success');
    }
  };

  const handleDeleteDebt = async (id: number) => {
    const result = await Swal.fire({ title: 'Hapus Hutang?', text: "Data cicilan ini akan ikut terhapus.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus' });
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/debt/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchFinanceData();
    }
  };

  const handleDebtPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!debtAmount || !payDebtId) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/finances/pay-debt`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ debtId: payDebtId, amount: parseInt(debtAmount.replace(/\D/g, '')) })
      });
      Swal.fire({ icon: 'success', title: 'Cicilan Dibayar!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      setDebtAmount(''); setPayDebtId(''); fetchFinanceData();
    } catch (err) { Swal.fire('Error', 'Gagal memproses pembayaran', 'error'); }
  };

  // --- CALCULATE FINANCIAL HEALTH ---
  const incomeThisMonth = data.summary.monthIncome || 0;
  const expenseThisMonth = data.summary.monthExpense || 0;
  const savingRate = incomeThisMonth > 0 ? ((incomeThisMonth - expenseThisMonth) / incomeThisMonth) * 100 : 0;
  const debtRatio = incomeThisMonth > 0 ? (data.totalDebtRemaining / incomeThisMonth) * 100 : 0;
  
  let healthScore = 100;
  if (expenseThisMonth > incomeThisMonth) healthScore -= 40; // Defisit
  if (debtRatio > 100) healthScore -= 30; // Hutang lebih besar dari gaji
  if (savingRate < 20 && savingRate >= 0) healthScore -= 10; // Kurang menabung
  healthScore = Math.max(0, healthScore);

  // --- DEBT ELIMINATION STRATEGY ---
  const prioritizedDebts = [...data.debts].sort((a, b) => a.remaining_debt - b.remaining_debt);
  const estimatedMonthsToDebtFree = data.totalDebtRemaining > 0 && monthlyCommitment > 0 ? Math.ceil(data.totalDebtRemaining / monthlyCommitment) : 0;

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20">

      {/* Header & Financial Health Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola aset, pantau pengeluaran, dan targetkan kebebasan finansial.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${healthScore >= 70 ? 'bg-emerald-50 text-emerald-500' : healthScore >= 40 ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
            <FaShieldAlt />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Health Score</p>
            <h4 className="text-lg font-black text-slate-800 leading-none">{healthScore} / 100</h4>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Saldo", amount: data.summary.balance, badge: "Keseluruhan", icon: <FaWallet />, color: "blue" },
          { title: "Pemasukan", amount: data.summary.monthIncome, badge: "Bulan Ini", icon: <FaArrowUp />, color: "emerald" },
          { title: "Pengeluaran", amount: data.summary.monthExpense, badge: "Bulan Ini", icon: <FaArrowDown />, color: "red" },
          { title: "Total Hutang", amount: data.totalDebtRemaining, badge: `${data.debts.length} Hutang Aktif`, icon: <FaCreditCard />, color: "orange" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</p>
              <h4 className="text-xl font-black text-slate-800">{formatRp(item.amount)}</h4>
              <p className={`text-[10px] font-bold text-${item.color}-500 mt-1 bg-${item.color}-50 px-2 py-0.5 rounded inline-block`}>{item.badge}</p>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ADD TRANSACTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
        <h3 className="text-lg font-black text-slate-800 mb-6 relative z-10">⚡ Quick Add Transaction</h3>
        <form onSubmit={handleQuickAdd} className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Jenis</label>
              <select value={qaType} onChange={(e) => setQaType(e.target.value as 'income' | 'expense')} className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:border-blue-400 cursor-pointer">
                <option value="expense">📉 Pengeluaran</option>
                <option value="income">📈 Pemasukan</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sumber Uang</label>
              <select value={qaSource} onChange={(e) => setQaSource(e.target.value)} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-blue-400 cursor-pointer">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</label>
              <select value={qaCategory} onChange={(e) => setQaCategory(e.target.value)} required className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 outline-none focus:border-blue-400 cursor-pointer">
                {qaType === 'income' 
                  ? INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                  : EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                }
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Jumlah (Rp)</label>
              <input type="text" inputMode="numeric" required value={qaAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setQaAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="0" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-blue-600 outline-none focus:border-blue-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tanggal</label>
              <input type="date" required value={qaDate} onChange={(e) => setQaDate(e.target.value)} className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium outline-none focus:border-blue-400 text-slate-700 cursor-pointer" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Catatan Keterangan</label>
              <input type="text" value={qaNote} onChange={(e) => setQaNote(e.target.value)} placeholder="Opsional (misal: Beli makan siang...)" className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <button type="submit" className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center gap-2 text-sm"><FaPlus /> Simpan</button>
            </div>
          </div>
        </form>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex justify-between">📊 Income vs Expense</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.barChart} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(val) => `Rp${val / 1000}k`} />
                <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value) => formatRp(Number(value))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart Kategori */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-black text-slate-800 mb-1">📈 Kategori Pengeluaran</h3>
          <p className="text-xs text-slate-500 mb-6">Analisis biaya bulan ini.</p>
          <div className="h-56 w-full relative flex-1">
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

      {/* REKAPAN & ANALISIS BULANAN */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          <FaHistory className="text-blue-500" /> Rekapan & Analisis Bulanan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest">
                <th className="p-4 font-bold rounded-l-xl">Bulan</th>
                <th className="p-4 font-bold text-right text-emerald-600">Pemasukan</th>
                <th className="p-4 font-bold text-right text-rose-600">Pengeluaran</th>
                <th className="p-4 font-bold text-right text-blue-600">Selisih Bersih (Net)</th>
                <th className="p-4 font-bold text-center rounded-r-xl">Trend Pengeluaran</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[...data.barChart].reverse().map((row, idx, arr) => {
                const netIncome = row.Income - row.Expense;
                const isPositive = netIncome >= 0;
                
                let trendIcon = '-';
                let trendColor = 'text-slate-400';
                if (idx < arr.length - 1) {
                   const prevRow = arr[idx + 1]; // Bulan sebelumnya (karena direverse)
                   if (row.Expense > prevRow.Expense) {
                     trendIcon = 'Lebih Boros 📈';
                     trendColor = 'text-rose-500';
                   } else if (row.Expense < prevRow.Expense) {
                     trendIcon = 'Lebih Hemat 📉';
                     trendColor = 'text-emerald-500';
                   } else {
                     trendIcon = 'Stabil ➖';
                     trendColor = 'text-slate-500';
                   }
                }

                return (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-800 font-black">{row.name}</td>
                    <td className="p-4 text-emerald-600 font-medium text-right">{formatRp(row.Income)}</td>
                    <td className="p-4 text-rose-500 font-medium text-right">{formatRp(row.Expense)}</td>
                    <td className="p-4 text-right">
                      <span className={`px-3 py-1 rounded-md text-xs font-black ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {isPositive ? '+' : ''}{formatRp(netIncome)}
                      </span>
                    </td>
                    <td className={`p-4 text-center text-xs font-bold ${trendColor}`}>
                       {trendIcon}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEBT ELIMINATION STRATEGY */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-1"><FaCreditCard className="text-orange-500" /> Debt Elimination Strategy</h3>
            <p className="text-xs text-slate-500 font-medium">Sistem merekomendasikan metode <strong>Snowball (Lunasi yang terkecil dulu)</strong>.</p>
          </div>
          
          {/* Target Lunas Estimator */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col flex-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Budget Bayar / Bulan</label>
              <div className="flex items-center gap-1">
                 <span className="text-xs font-bold text-slate-400">Rp</span>
                 <input 
                   type="text" 
                   inputMode="numeric"
                   value={monthlyCommitmentStr} 
                   onChange={(e) => { 
                     const val = e.target.value.replace(/\D/g, ''); 
                     setMonthlyCommitmentStr(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); 
                   }} 
                   className="w-24 bg-transparent outline-none text-sm font-black text-slate-700" 
                 />
              </div>
            </div>
            <div className="bg-orange-100 px-3 py-2 rounded-md text-center border border-orange-200">
               <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mb-0.5">Estimasi Lunas</p>
               <p className="text-sm font-black text-orange-700">{estimatedMonthsToDebtFree} Bulan</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
           <button onClick={handleAddDebt} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md">
             <FaPlus /> Tambah Hutang
           </button>
        </div>

        {/* List Hutang Prioritas - BUTTON DI PERBAIKI DISINI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {prioritizedDebts.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-10 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl">Belum ada hutang. Anda bebas! 🎉</div>
          ) : (
            prioritizedDebts.map((debt, index) => {
              const progress = Math.round((Number(debt.total_paid) / Number(debt.total_debt)) * 100);
              const isPriority = index === 0; 
              return (
                <div key={debt.id} className={`p-5 rounded-2xl border transition-all ${isPriority ? 'bg-orange-50 border-orange-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-black ${isPriority ? 'text-orange-700' : 'text-slate-800'}`}>{debt.name}</h4>
                        {isPriority && <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">Prioritas 1</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold"><FaCalendarAlt /> Tempo: {debt.due_date ? new Date(debt.due_date).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                    {/* TOMBOL EDIT/HAPUS DIBUAT SELALU TERLIHAT DAN BERBENTUK KOTAK */}
                    <div className="flex gap-2">
                      <button onClick={() => handleEditDebt(debt)} className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors text-xs" title="Edit Hutang"><FaEdit /></button>
                      <button onClick={() => handleDeleteDebt(debt.id)} className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-xs" title="Hapus Hutang"><FaTrash /></button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">Sisa: <span className={isPriority ? 'text-orange-600' : 'text-slate-800'}>{formatRp(debt.remaining_debt)}</span></span>
                    <span className={isPriority ? 'text-orange-500' : 'text-slate-400'}>{progress}% Terbayar</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isPriority ? 'bg-orange-200' : 'bg-slate-200'}`}>
                    <div className={`${isPriority ? 'bg-orange-500' : 'bg-slate-400'} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Form Pembayaran Dropdown */}
        <form onSubmit={handleDebtPayment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-auto flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pilih Hutang yang Dibayar</label>
            <select value={payDebtId} onChange={(e) => setPayDebtId(e.target.value)} required className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-700 bg-white">
              <option value="" disabled>-- Pilih Hutang --</option>
              {prioritizedDebts.map(d => <option key={d.id} value={d.id}>{d.name} (Sisa: {formatRp(d.remaining_debt)})</option>)}
            </select>
          </div>
          <div className="w-full sm:w-1/3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nominal Bayar</label>
            <input type="text" inputMode="numeric" required value={debtAmount} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setDebtAmount(val ? new Intl.NumberFormat('id-ID').format(Number(val)) : ''); }} placeholder="Rp 0" className="w-full p-3 rounded-xl border border-slate-200 outline-none text-sm font-bold bg-white" />
          </div>
          <button type="submit" disabled={data.debts.length === 0} className="w-full sm:w-auto p-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all text-sm px-8">Catat Cicilan</button>
        </form>
      </div>

      {/* Tabel Transaksi Terakhir */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-lg font-black text-slate-800 mb-6">📋 Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest">
                <th className="p-4 font-bold rounded-l-xl">Tanggal</th>
                <th className="p-4 font-bold">Jenis</th>
                <th className="p-4 font-bold">Sumber Uang</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Catatan</th>
                <th className="p-4 font-bold text-right">Jumlah</th>
                <th className="p-4 font-bold text-center rounded-r-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.transactions.map((trx, idx) => {
                const isBigExpense = trx.type === 'expense' && trx.amount > 500000;
                
                return (
                  <tr key={idx} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${isBigExpense ? 'bg-red-50/30' : ''}`}>
                    <td className="p-4 text-slate-500 font-medium text-xs">{new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{trx.type}</span></td>
                    <td className="p-4 text-slate-600 font-medium text-xs">{trx.source || '-'}</td>
                    <td className="p-4 text-slate-800 font-bold">{trx.category}</td>
                    <td className="p-4 text-slate-700 font-medium">
                      {trx.note || '-'}
                      {isBigExpense && <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">Besar ⚠</span>}
                    </td>
                    <td className={`p-4 font-black text-right ${trx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>{trx.type === 'income' ? '+' : '-'} {formatRp(trx.amount)}</td>
                    <td className="p-4 flex justify-center gap-3 text-slate-400">
                      <button onClick={() => handleEditTransaction(trx)} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"><FaEdit /></button>
                      <button onClick={() => handleDeleteTransaction(trx.id)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"><FaTrash /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Finance;