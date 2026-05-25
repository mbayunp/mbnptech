// src/pages/admin/Wedding.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import {
  Gem, Wallet, Store, Calendar,
  PieChart, AlertTriangle, Lightbulb, Heart,
  CreditCard, Coins, Plus, Trash2, CheckCircle, Clock, Pencil, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticGlowCard from '../../components/MagneticGlowCard';

const Wedding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState({ totalBudget: 0, totalUsed: 0, totalIncome: 0, progress: 0 });
  const [budgets, setBudgets] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  const fetchWeddingData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch(`${API_URL}/api/wedding`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();

      if (result.success) {
        setSummary(result.data.summary);
        setBudgets(result.data.budgets);
        setExpenses(result.data.expenses);
        setContributions(result.data.contributions);
        setVendors(result.data.vendors);
        setTimeline(result.data.timeline || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatRp = (angka: number) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(angka || 0);
    return `Rp. ${formatted}`;
  };

  const getDaysLeft = () => {
    const target = new Date("2026-12-25T00:00:00");
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysLeft();
  const usedPercent = summary.totalBudget === 0 ? 0 : Math.min(100, Math.round((summary.totalUsed / summary.totalBudget) * 100));

  // ==========================================
  // ACTION HANDLERS (CRUD)
  // ==========================================

  const handleAddBudget = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Kategori Budget',
      html: `
        <input id="w-cat" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Kategori (Misal: Catering)">
        <input id="w-budget" type="text" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nominal Budget (Misal: Rp. 10.000.000)">
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      didOpen: () => {
        const inputBudget = document.getElementById('w-budget') as HTMLInputElement;
        inputBudget.addEventListener('input', function () {
          let val = this.value.replace(/[^0-9]/g, "");
          if (val) this.value = "Rp. " + new Intl.NumberFormat("id-ID").format(parseInt(val, 10));
          else this.value = "";
        });
      },
      preConfirm: () => {
        const rawBudget = (document.getElementById('w-budget') as HTMLInputElement).value.replace(/[^0-9]/g, "");
        return {
          category: (document.getElementById('w-cat') as HTMLInputElement).value,
          budget: rawBudget
        }
      }
    });

    if (formValues && formValues.budget) {
      await fetch(`${API_URL}/api/wedding/budgets`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      fetchWeddingData();
    }
  };

  const handleDeleteBudget = async (id: number) => {
    const confirm = await Swal.fire({ title: 'Hapus Kategori?', text: "Data akan terhapus permanen.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' } });
    if (confirm.isConfirmed) {
      await fetch(`${API_URL}/api/wedding/budgets/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      fetchWeddingData();
    }
  };

  const handleAddExpense = async () => {
    if (budgets.length === 0) return Swal.fire({ title: 'Oops', text: 'Buat kategori budget dulu!', icon: 'warning', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' } });
    let optionsHtml = budgets.map(b => `<option value="${b.id}">${b.category}</option>`).join('');

    const { value: formValues } = await Swal.fire({
      title: 'Catat Pengeluaran',
      html: `
        <select id="e-budget" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none">${optionsHtml}</select>
        <input id="e-vendor" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Vendor">
        <input id="e-amount" type="text" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Jumlah Bayar (Rp)">
        <input id="e-date" type="date" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" value="${new Date().toISOString().split('T')[0]}">
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      didOpen: () => {
        const inputAmount = document.getElementById('e-amount') as HTMLInputElement;
        inputAmount.addEventListener('input', function () {
          let val = this.value.replace(/[^0-9]/g, "");
          if (val) this.value = "Rp. " + new Intl.NumberFormat("id-ID").format(parseInt(val, 10));
          else this.value = "";
        });
      },
      preConfirm: () => {
        const rawAmount = (document.getElementById('e-amount') as HTMLInputElement).value.replace(/[^0-9]/g, "");
        return {
          budget_id: (document.getElementById('e-budget') as HTMLSelectElement).value,
          vendor: (document.getElementById('e-vendor') as HTMLInputElement).value,
          amount: rawAmount,
          log_date: (document.getElementById('e-date') as HTMLInputElement).value,
        }
      }
    });

    if (formValues && formValues.amount) {
      await fetch(`${API_URL}/api/wedding/expenses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      fetchWeddingData();
    }
  };

  const handleAddContribution = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Pemasukan',
      html: `
        <input id="c-name" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Pemberi (Misal: Tabungan Bersama)">
        <select id="c-type" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none">
          <option value="Pribadi">Pribadi</option>
          <option value="Keluarga">Keluarga / Orang Tua</option>
          <option value="Sponsor">Sponsor / Lainnya</option>
        </select>
        <input id="c-amount" type="text" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nominal (Misal: Rp. 20.000.000)">
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      didOpen: () => {
        const inputAmount = document.getElementById('c-amount') as HTMLInputElement;
        inputAmount.addEventListener('input', function () {
          let val = this.value.replace(/[^0-9]/g, "");
          if (val) this.value = "Rp. " + new Intl.NumberFormat("id-ID").format(parseInt(val, 10));
          else this.value = "";
        });
      },
      preConfirm: () => {
        const rawAmount = (document.getElementById('c-amount') as HTMLInputElement).value.replace(/[^0-9]/g, "");
        return {
          name: (document.getElementById('c-name') as HTMLInputElement).value,
          type: (document.getElementById('c-type') as HTMLSelectElement).value,
          amount: rawAmount
        }
      }
    });

    if (formValues && formValues.amount) {
      await fetch(`${API_URL}/api/wedding/contributions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      fetchWeddingData();
    }
  };

  const handleEditContribution = async (c: any) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Pemasukan',
      html: `
        <input id="c-name-edit" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Pemberi" value="${c.name}">
        <select id="c-type-edit" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none">
          <option value="Pribadi" ${c.type === 'Pribadi' ? 'selected' : ''}>Pribadi</option>
          <option value="Keluarga" ${c.type === 'Keluarga' ? 'selected' : ''}>Keluarga / Orang Tua</option>
          <option value="Sponsor" ${c.type === 'Sponsor' ? 'selected' : ''}>Sponsor / Lainnya</option>
        </select>
        <input id="c-amount-edit" type="text" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nominal" value="Rp. ${new Intl.NumberFormat('id-ID').format(c.amount)}">
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      didOpen: () => {
        const inputAmount = document.getElementById('c-amount-edit') as HTMLInputElement;
        inputAmount.addEventListener('input', function () {
          let val = this.value.replace(/[^0-9]/g, "");
          if (val) this.value = "Rp. " + new Intl.NumberFormat("id-ID").format(parseInt(val, 10));
          else this.value = "";
        });
      },
      preConfirm: () => {
        const rawAmount = (document.getElementById('c-amount-edit') as HTMLInputElement).value.replace(/[^0-9]/g, "");
        return {
          name: (document.getElementById('c-name-edit') as HTMLInputElement).value,
          type: (document.getElementById('c-type-edit') as HTMLSelectElement).value,
          amount: rawAmount
        }
      }
    });

    if (formValues && formValues.amount) {
      await fetch(`${API_URL}/api/wedding/contributions/${c.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      Swal.fire({ icon: 'success', title: 'Diperbarui', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      fetchWeddingData();
    }
  };

  const handleDeleteContribution = async (id: number) => {
    const confirm = await Swal.fire({ title: 'Hapus Pemasukan?', text: "Apakah Anda yakin ingin menghapus data ini?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' } });
    if (confirm.isConfirmed) {
      await fetch(`${API_URL}/api/wedding/contributions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      Swal.fire({ icon: 'success', title: 'Dihapus', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
      fetchWeddingData();
    }
  };

  const handleAddVendor = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Vendor Baru',
      html: `
        <input id="v-name" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Vendor">
        <input id="v-cat" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Kategori (Misal: MUA)">
        <input id="v-price" type="text" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Total Harga Deal (Rp)">
        <select id="v-status" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none">
          <option value="Belum Deal">Belum Deal</option>
          <option value="DP">Sudah DP</option>
          <option value="Lunas">Lunas</option>
        </select>
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      didOpen: () => {
        const inputPrice = document.getElementById('v-price') as HTMLInputElement;
        inputPrice.addEventListener('input', function () {
          let val = this.value.replace(/[^0-9]/g, "");
          if (val) this.value = "Rp. " + new Intl.NumberFormat("id-ID").format(parseInt(val, 10));
          else this.value = "";
        });
      },
      preConfirm: () => {
        const rawPrice = (document.getElementById('v-price') as HTMLInputElement).value.replace(/[^0-9]/g, "");
        return {
          name: (document.getElementById('v-name') as HTMLInputElement).value,
          category: (document.getElementById('v-cat') as HTMLInputElement).value,
          price: rawPrice,
          status: (document.getElementById('v-status') as HTMLSelectElement).value,
        }
      }
    });

    if (formValues && formValues.name) {
      await fetch(`${API_URL}/api/wedding/vendors`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      fetchWeddingData();
    }
  };

  const handleAddTimeline = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Agenda',
      html: `
        <input id="t-task" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" placeholder="Nama Kegiatan (Misal: Fitting Baju)">
        <input id="t-date" type="date" class="w-full p-3 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 dark:text-white outline-none" value="${new Date().toISOString().split('T')[0]}">
      `,
      customClass: { popup: 'rounded-[2rem] dark:bg-[#0B0F19]' },
      preConfirm: () => ({
        task: (document.getElementById('t-task') as HTMLInputElement).value,
        due_date: (document.getElementById('t-date') as HTMLInputElement).value
      })
    });

    if (formValues && formValues.task) {
      await fetch(`${API_URL}/api/wedding/timeline`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formValues)
      });
      fetchWeddingData();
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-[#F8FAFC] dark:bg-[#030712]"><div className="w-12 h-12 border-4 rounded-full border-rose-200 border-t-rose-600 animate-spin"></div></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-8xl mx-auto pb-20 dark:text-white"
    >
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white font-display">
            <Gem className="text-rose-500" /> Wedding Hub
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Persiapan Keuangan & Agenda Pernikahan • Desember 2026</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 text-xs font-black bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
            Keuangan Terkumpul: {summary.progress}%
          </div>
        </div>
      </div>

      {/* Tabs Menu Slider */}
      <div className="flex gap-2 mb-8 overflow-x-auto bg-slate-100 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/[0.05] shadow-sm">
        {[
          { id: 'summary', icon: <PieChart size={15} />, label: 'Ringkasan' },
          { id: 'budget', icon: <Wallet size={15} />, label: 'Budget & Dana Masuk' },
          { id: 'vendor', icon: <Store size={15} />, label: 'Vendor & DP' },
          { id: 'timeline', icon: <Calendar size={15} />, label: 'Timeline Agenda' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className="relative flex items-center whitespace-nowrap gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-colors duration-200 outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="weddingTabIndicator"
                  className="absolute inset-0 bg-rose-500 rounded-xl shadow-md shadow-rose-500/25"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white'}`}>
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {/* ======================= TAB 1: SUMMARY ======================= */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {[
                  { title: "Total Alokasi Budget", val: summary.totalBudget, bg: "bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-white border-slate-200/50 dark:border-white/[0.05]" },
                  { title: "Total Terpakai", val: summary.totalUsed, bg: "bg-gradient-to-br from-rose-500 to-pink-600 text-white border-transparent shadow-lg shadow-rose-500/10" },
                  { title: "Total Pemasukan", val: summary.totalIncome, bg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent shadow-lg shadow-emerald-500/10" },
                  { title: "Sisa Dana / Selisih", val: summary.totalIncome - summary.totalUsed, valColor: summary.totalIncome - summary.totalUsed < 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-450', bg: "bg-white dark:bg-[#0B0F19] border-slate-200/50 dark:border-white/[0.05]" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-[2rem] border ${item.bg} transition-all duration-300`}>
                    <p className="text-[10px] font-black uppercase tracking-wider opacity-75 mb-1.5">{item.title}</p>
                    <h4 className={`text-xl font-black font-display ${item.valColor || ''}`}>{formatRp(item.val)}</h4>
                  </div>
                ))}
              </div>

              {/* Bento Row: Insight, Countdown, and Progress ring */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Side: Countdown & Progress Ratio */}
                <div className="space-y-6">
                  {/* Countdown Card */}
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 md:p-8 rounded-[2rem] text-white relative overflow-hidden shadow-lg shadow-rose-500/10 border border-rose-500/25">
                    <div className="absolute top-0 right-0 w-36 h-36 -translate-y-1/3 rounded-full pointer-events-none bg-white/10 blur-2xl translate-x-1/3"></div>
                    <div className="relative z-10">
                      <p className="text-[9px] font-black text-rose-100 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Heart size={11} className="animate-pulse" /> Countdown Pernikahan</p>
                      <h3 className="text-4xl font-black font-display">{daysLeft} <span className="text-base font-bold">Hari</span></h3>
                      <p className="text-xs text-rose-100/90 mt-2 font-medium">Hingga 25 Desember 2026</p>
                    </div>
                  </div>

                  {/* Budget Ratio Progress Donut */}
                  <div className="bg-white dark:bg-[#0B0F19] p-6 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05] flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Rasio Budget Terpakai</p>
                      <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{usedPercent}%</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Dari total alokasi yang direncanakan.</p>
                    </div>
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="26" className="stroke-slate-100 dark:stroke-white/5" strokeWidth="4.5" fill="transparent" />
                        <circle cx="32" cy="32" r="26" className="stroke-rose-500 transition-all duration-500" strokeWidth="5" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * usedPercent) / 100} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-rose-650 dark:text-rose-400">{usedPercent}%</div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Insights */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05] flex flex-col justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 mb-6 text-base font-black text-slate-800 dark:text-white font-display"><Lightbulb className="text-amber-400" size={17} /> Analisis Alokasi Dana</h3>
                    <ul className="space-y-4 text-xs font-medium">
                      {summary.totalIncome < summary.totalUsed ? (
                        <li className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 p-3.5 rounded-2xl border border-red-200 dark:border-red-500/20 text-slate-700 dark:text-red-300">
                          <AlertTriangle className="text-red-500 shrink-0" size={16} />
                          <div>
                            <strong className="text-red-700 dark:text-red-400 block mb-0.5">Defisit Keuangan Pernikahan!</strong>
                            Uang masuk ({formatRp(summary.totalIncome)}) lebih kecil dari total pengeluaran terealisasi ({formatRp(summary.totalUsed)}). Segera review pengeluaran vendor.
                          </div>
                        </li>
                      ) : (
                        <li className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 text-slate-700 dark:text-emerald-300">
                          <CheckCircle className="text-emerald-500 shrink-0" size={16} />
                          <div>
                            <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">Kondisi Aman</strong>
                            Total dana masuk saat ini masih mencukupi pengeluaran yang telah dicatat.
                          </div>
                        </li>
                      )}
                      
                      <li className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-white/5 text-slate-655 dark:text-slate-400">
                        <Sparkles className="text-amber-400 shrink-0" size={15} /> 
                        <div>
                          <strong className="text-slate-800 dark:text-white block mb-0.5">Biaya Tak Terduga</strong>
                          Sediakan cadangan dana tunai setidaknya 10% dari alokasi budget untuk pengeluaran dadakan (petugas KUA, tip kru, print darurat, dll) di hari H.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: BUDGET & INCOME ======================= */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              {/* Budget Allocation Table */}
              <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white font-display">Alokasi Anggaran Kategori</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleAddExpense} className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl transition-all flex items-center gap-1.5"><CreditCard size={14} /> Catat Pengeluaran</button>
                    <button onClick={handleAddBudget} className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-650/15 flex items-center gap-1.5"><Plus size={14} /> Tambah Kategori</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30">
                        <th className="p-4 rounded-l-xl font-bold">Kategori</th>
                        <th className="p-4 font-bold text-right">Dianggarkan</th>
                        <th className="p-4 font-bold text-right">Terpakai</th>
                        <th className="p-4 font-bold text-right">Selisih</th>
                        <th className="p-4 text-center rounded-r-xl font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {budgets.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 dark:text-slate-500 font-medium">Belum ada kategori budget.</td></tr>
                      ) : (
                        budgets.map(b => (
                          <tr key={b.id} className="border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{b.category}</td>
                            <td className="p-4 text-right font-medium">{formatRp(b.budget)}</td>
                            <td className="p-4 text-right text-slate-550 dark:text-slate-400">{formatRp(b.actual)}</td>
                            <td className={`p-4 text-right font-black ${b.budget - b.actual < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatRp(b.budget - b.actual)}</td>
                            <td className="p-4 text-center">
                              <button onClick={() => handleDeleteBudget(b.id)} className="p-2 text-slate-350 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"><Trash2 size={13} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expense and Contributions columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* History Expense */}
                <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-display"><CreditCard className="text-rose-500" size={17} /> Riwayat Pembayaran Pengeluaran</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                    {expenses.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-medium">Belum ada catatan pengeluaran.</p>
                    ) : (
                      expenses.map(e => (
                        <div key={e.id} className="p-4 bg-slate-50/50 dark:bg-[#151b2c]/10 border border-slate-100 dark:border-white/5 rounded-2xl flex justify-between items-center hover:border-rose-300 transition-all">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm font-display">{e.vendor || e.budget_category}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{new Date(e.log_date).toLocaleDateString('id-ID')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-rose-600 dark:text-rose-400 font-black text-sm">- {formatRp(e.amount)}</p>
                            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0B0F19] border dark:border-white/10 px-1.5 py-0.5 rounded inline-block mt-0.5">{e.budget_category}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Contributions */}
                <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 font-display"><Coins className="text-emerald-500" size={17} /> Pemasukan & Sumber Dana</h3>
                    <button onClick={handleAddContribution} className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center gap-1 transition-colors"><Plus size={11} /> Tambah Dana</button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                    {contributions.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-medium">Belum ada dana masuk.</p>
                    ) : (
                      contributions.map(c => (
                        <div key={c.id} className="group p-4 bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-white/5 rounded-2xl flex justify-between items-center hover:border-emerald-300 dark:hover:border-emerald-500/20 shadow-sm transition-all">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm font-display">{c.name}</h4>
                            <p className="text-[9px] text-slate-400 dark:text-slate-550 uppercase tracking-widest font-black">{c.type}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-emerald-500 dark:text-emerald-400 font-black text-sm">+ {formatRp(c.amount)}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditContribution(c)} className="p-1.5 text-slate-450 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg"><Pencil size={11} /></button>
                              <button onClick={() => handleDeleteContribution(c.id)} className="p-1.5 text-slate-455 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"><Trash2 size={11} /></button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: VENDOR ======================= */}
          {activeTab === 'vendor' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b dark:border-white/5 pb-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white font-display">Daftar Vendor Rekanan</h3>
                  <button onClick={handleAddVendor} className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-600/15 flex items-center gap-1.5"><Plus size={14} /> Tambah Vendor</button>
                </div>
                {vendors.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <Store className="mx-auto mb-3 text-slate-300 dark:text-slate-700" size={36} />
                    <p className="text-sm font-medium">Belum ada vendor yang dicatat.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vendors.map(v => (
                      <div key={v.id} className="p-6 border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#151b2c]/10 rounded-3xl hover:border-indigo-400 hover:shadow-sm transition-all duration-300">
                        <div className="flex justify-between items-center mb-4">
                          <span className="px-2.5 py-1 text-[9px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-transparent">{v.category}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            v.status === 'Lunas' ? 'text-emerald-500' : v.status === 'DP' ? 'text-amber-500' : 'text-slate-400'
                          }`}>{v.status}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-850 dark:text-white font-display leading-tight truncate">{v.name}</h4>
                        <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-white/5">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">Harga Deal Kesepakatan:</p>
                          <p className="font-black text-slate-800 dark:text-slate-200 text-base">{formatRp(v.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB 4: TIMELINE ======================= */}
          {activeTab === 'timeline' && (
            <div className="bg-white dark:bg-[#0B0F19] p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/50 dark:border-white/[0.05]">
              <div className="flex justify-between items-center mb-8 border-b dark:border-white/5 pb-4">
                <h3 className="text-base font-black text-slate-800 dark:text-white font-display">Timeline & Agenda Persiapan</h3>
                <button onClick={handleAddTimeline} className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center gap-1.5"><Plus size={14} /> Tambah Agenda</button>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                  <Calendar className="mx-auto mb-3 text-slate-300 dark:text-slate-700" size={36} />
                  <p className="text-sm font-medium">Belum ada timeline agenda persiapan.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-white/5 ml-2">
                  {timeline.map(item => (
                    <div key={item.id} className="relative pl-12 group">
                      <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white dark:border-[#0B0F19] flex items-center justify-center text-white transition-colors ${
                        item.status === 'done' 
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' 
                          : 'bg-slate-300 dark:bg-slate-800 group-hover:bg-rose-500'
                      }`}>
                        {item.status === 'done' ? <CheckCircle size={13} /> : <Clock size={13} />}
                      </div>
                      <h4 className={`font-black text-base font-display ${item.status === 'done' ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-850 dark:text-slate-200'}`}>{item.task}</h4>
                      <p className="text-[9px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest mt-0.5">{
                        new Date(item.due_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                      }</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Wedding;