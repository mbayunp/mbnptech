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
import { motion } from 'framer-motion';

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

    // ==========================================
    // ACTION HANDLERS (CRUD)
    // ==========================================

    const handleAddBudget = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Kategori Budget',
            html: `
        <input id="w-cat" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 outline-none" placeholder="Nama Kategori (Misal: Catering)">
        <input id="w-budget" type="text" class="w-full p-3 border rounded-lg outline-none" placeholder="Nominal Budget (Misal: Rp. 10.000.000)">
      `,
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
        const confirm = await Swal.fire({ title: 'Hapus Kategori?', text: "Data akan terhapus permanen.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
        if (confirm.isConfirmed) {
            await fetch(`${API_URL}/api/wedding/budgets/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            fetchWeddingData();
        }
    };

    const handleAddExpense = async () => {
        if (budgets.length === 0) return Swal.fire('Oops', 'Buat kategori budget dulu!', 'warning');
        let optionsHtml = budgets.map(b => `<option value="${b.id}">${b.category}</option>`).join('');

        const { value: formValues } = await Swal.fire({
            title: 'Catat Pengeluaran',
            html: `
        <select id="e-budget" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 outline-none">${optionsHtml}</select>
        <input id="e-vendor" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Vendor">
        <input id="e-amount" type="text" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Jumlah Bayar (Rp)">
        <input id="e-date" type="date" class="w-full p-3 border rounded-lg outline-none" value="${new Date().toISOString().split('T')[0]}">
      `,
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
        <input id="c-name" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Pemberi (Misal: Tabungan Bersama)">
        <select id="c-type" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 outline-none">
          <option value="Pribadi">Pribadi</option>
          <option value="Keluarga">Keluarga / Orang Tua</option>
          <option value="Sponsor">Sponsor / Lainnya</option>
        </select>
        <input id="c-amount" type="text" class="w-full p-3 border rounded-lg outline-none" placeholder="Nominal (Misal: Rp. 20.000.000)">
      `,
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

    // --- FITUR BARU: EDIT PEMASUKAN ---
    const handleEditContribution = async (c: any) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Pemasukan',
            html: `
        <input id="c-name-edit" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Pemberi" value="${c.name}">
        <select id="c-type-edit" class="w-full p-3 mb-3 border rounded-lg bg-slate-50 outline-none">
          <option value="Pribadi" ${c.type === 'Pribadi' ? 'selected' : ''}>Pribadi</option>
          <option value="Keluarga" ${c.type === 'Keluarga' ? 'selected' : ''}>Keluarga / Orang Tua</option>
          <option value="Sponsor" ${c.type === 'Sponsor' ? 'selected' : ''}>Sponsor / Lainnya</option>
        </select>
        <input id="c-amount-edit" type="text" class="w-full p-3 border rounded-lg outline-none" placeholder="Nominal" value="Rp. ${new Intl.NumberFormat('id-ID').format(c.amount)}">
      `,
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

    // --- FITUR BARU: HAPUS PEMASUKAN ---
    const handleDeleteContribution = async (id: number) => {
        const confirm = await Swal.fire({ title: 'Hapus Pemasukan?', text: "Apakah Anda yakin ingin menghapus data ini?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
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
        <input id="v-name" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Vendor">
        <input id="v-cat" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Kategori (Misal: MUA)">
        <input id="v-price" type="text" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Total Harga Deal (Rp)">
        <select id="v-status" class="w-full p-3 border rounded-lg bg-slate-50 outline-none">
          <option value="Belum Deal">Belum Deal</option>
          <option value="DP">Sudah DP</option>
          <option value="Lunas">Lunas</option>
        </select>
      `,
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
        <input id="t-task" class="w-full p-3 mb-3 border rounded-lg outline-none" placeholder="Nama Kegiatan (Misal: Fitting Baju)">
        <input id="t-date" type="date" class="w-full p-3 border rounded-lg outline-none" value="${new Date().toISOString().split('T')[0]}">
      `,
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


    if (isLoading) return <div className="flex items-center justify-center h-screen bg-[#F8FAFC]"><div className="w-12 h-12 border-4 rounded-full border-rose-200 border-t-rose-600 animate-spin"></div></div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20"
        >

            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                    <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 font-display">
                        <Gem className="text-rose-500" /> Wedding Planner
                    </h2>
                    <p className="text-sm font-medium text-slate-500">Persiapan Mas Bayu & Pasangan • Desember 2026</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-rose-600">
                        Keuangan Ready: {summary.progress}%
                    </div>
                </div>
            </div>

            {/* Tabs Menu */}
            <div className="flex gap-2 mb-8 overflow-x-auto bg-white border p-2 rounded-2xl border-slate-100 shadow-sm custom-scrollbar">
                {[
                    { id: 'summary', icon: <PieChart size={16} />, label: 'Summary' },
                    { id: 'budget', icon: <Wallet size={16} />, label: 'Budget & Income' },
                    { id: 'vendor', icon: <Store size={16} />, label: 'Vendor & Payment' },
                    { id: 'timeline', icon: <Calendar size={16} />, label: 'Timeline' },
                ].map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className="relative flex items-center whitespace-nowrap gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-200 outline-none"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 bg-rose-500 rounded-xl shadow-md shadow-rose-500/20"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                                {tab.icon}
                                <span>{tab.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ======================= TAB 1: SUMMARY ======================= */}
            {activeTab === 'summary' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Anggaran</p>
                            <h4 className="text-xl font-black font-display">{formatRp(summary.totalBudget)}</h4>
                        </div>
                        <div className="p-6 text-white bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20 rounded-[2rem]">
                            <p className="text-[10px] font-bold text-rose-100 uppercase tracking-widest mb-1 flex items-center gap-1"><Coins size={14} /> Total Terpakai</p>
                            <h4 className="text-xl font-black font-display">{formatRp(summary.totalUsed)}</h4>
                        </div>
                        <div className="p-6 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 rounded-[2rem]">
                            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1 flex items-center gap-1"><Coins size={14} /> Total Pemasukan</p>
                            <h4 className="text-xl font-black font-display">{formatRp(summary.totalIncome)}</h4>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa Dana / Kekurangan</p>
                            <h4 className={`text-xl font-black font-display ${summary.totalIncome - summary.totalUsed < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {formatRp(summary.totalIncome - summary.totalUsed)}
                            </h4>
                        </div>
                    </div>

                    <div className="p-8 text-white bg-slate-900 rounded-3xl shadow-xl">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-black font-display"><Lightbulb className="text-amber-400" size={18} /> Financial Insights</h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            {summary.totalIncome < summary.totalUsed && (
                                <li className="flex items-start gap-3 bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                                    <AlertTriangle className="text-red-400 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <strong className="text-red-200 block mb-1">Defisit Keuangan!</strong>
                                        Pengeluaran saat ini melampaui uang masuk yang ada. Segera alokasikan dana tambahan.
                                    </div>
                                </li>
                            )}
                            {summary.progress > 80 && (
                                <li className="flex items-start gap-3 bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
                                    <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={18} />
                                    <div>
                                        <strong className="text-emerald-200 block mb-1">On Track!</strong>
                                        Persiapan keuangan sudah sangat matang. Pertahankan!
                                    </div>
                                </li>
                            )}
                            <li className="flex items-start gap-3 bg-white/10 p-3 rounded-xl border border-white/10 text-slate-300">
                                <Sparkles className="text-amber-400 mt-0.5 shrink-0" size={16} /> 
                                <div><strong className="text-white">Tips Developer:</strong> Jangan lupa sediakan minimal 10% dari budget untuk biaya tak terduga (misal tips kru/vendor) di hari H.</div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ======================= TAB 2: BUDGET & INCOME ======================= */}
            {activeTab === 'budget' && (
                <div className="space-y-6 animate-fade-in">

                    {/* BUDGET TABLE */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-black text-slate-800 font-display">Alokasi Budget</h3>
                            <div className="flex gap-2">
                                <button onClick={handleAddExpense} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-2"><CreditCard size={16} /> Catat Pengeluaran</button>
                                <button onClick={handleAddBudget} className="px-4 py-2 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-md shadow-rose-600/20 flex items-center gap-2"><Plus size={16} /> Tambah Kategori</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100 bg-slate-50">
                                        <th className="p-4 rounded-tl-xl">Kategori</th>
                                        <th className="p-4">Dianggarkan</th>
                                        <th className="p-4">Terpakai</th>
                                        <th className="p-4">Selisih</th>
                                        <th className="p-4 text-center rounded-tr-xl">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {budgets.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">Belum ada kategori budget.</td></tr> : budgets.map(b => (
                                        <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800">{b.category}</td>
                                            <td className="p-4">{formatRp(b.budget)}</td>
                                            <td className="p-4 text-slate-600">{formatRp(b.actual)}</td>
                                            <td className={`p-4 font-black ${b.budget - b.actual < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatRp(b.budget - b.actual)}</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleDeleteBudget(b.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* HISTORY EXPENSE */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 font-display"><CreditCard className="text-rose-500" size={18} /> Riwayat Pengeluaran</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {expenses.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">Belum ada pengeluaran.</p> : expenses.map(e => (
                                    <div key={e.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-rose-200 transition-all">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm font-display">{e.vendor || e.budget_category}</h4>
                                            <p className="text-[10px] text-slate-500">{new Date(e.log_date).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-rose-600 font-black text-sm">- {formatRp(e.amount)}</p>
                                            <p className="text-[9px] uppercase font-bold text-slate-400 bg-white border px-1 rounded">{e.budget_category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* HISTORY INCOME / CONTRIBUTION */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 font-display"><Coins className="text-emerald-500" size={18} /> Pemasukan & Sponsor</h3>
                                <button onClick={handleAddContribution} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 flex items-center gap-1"><Plus size={12} /> Tambah</button>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {contributions.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">Belum ada pemasukan.</p> : contributions.map(c => (
                                    <div key={c.id} className="group p-4 bg-white border border-slate-100 shadow-sm rounded-2xl flex justify-between items-center hover:border-emerald-200 transition-all">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm font-display">{c.name}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{c.type}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-emerald-500 font-black text-sm">+ {formatRp(c.amount)}</p>
                                            </div>
                                            {/* TOMBOL EDIT DAN HAPUS MUNCUL SAAT DI-HOVER */}
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditContribution(c)} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={12} /></button>
                                                <button onClick={() => handleDeleteContribution(c.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* ======================= TAB 3: VENDOR ======================= */}
            {activeTab === 'vendor' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-black text-slate-800 font-display">Vendor Tracker</h3>
                            <button onClick={handleAddVendor} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2"><Plus size={16} /> Tambah Vendor</button>
                        </div>
                        {vendors.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <Store className="text-4xl mx-auto mb-3 text-slate-200" size={40} />
                                <p>Belum ada vendor yang dicatat.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {vendors.map(v => (
                                    <div key={v.id} className="p-6 border bg-slate-50 border-slate-100 rounded-3xl hover:shadow-md hover:border-indigo-200 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-2 py-1 text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 rounded-md">{v.category}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${v.status === 'Lunas' ? 'text-emerald-600' : v.status === 'DP' ? 'text-amber-500' : 'text-slate-400'}`}>{v.status}</span>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 truncate font-display">{v.name}</h4>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-xs text-slate-500 mb-1">Total Harga Deal:</p>
                                            <p className="font-bold text-slate-800 text-lg">{formatRp(v.price)}</p>
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
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800 font-display">Timeline Persiapan</h3>
                        <button onClick={handleAddTimeline} className="px-4 py-2 text-sm font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 shadow-md flex items-center gap-2"><Plus size={16} /> Tambah Agenda</button>
                    </div>

                    {timeline.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <Calendar className="text-4xl mx-auto mb-3 text-slate-200" size={40} />
                            <p>Belum ada agenda persiapan.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 ml-2">
                            {timeline.map(item => (
                                <div key={item.id} className="relative pl-12 group">
                                    <div className={`absolute left-0 top-1 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center text-white transition-colors ${item.status === 'done' ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-rose-400'}`}>
                                        {item.status === 'done' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    </div>
                                    <h4 className={`font-black text-lg font-display ${item.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.task}</h4>
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">{new Date(item.due_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </motion.div>
    );
};

export default Wedding;