// src/pages/admin/Achievements.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    FaTrophy, FaPlus, FaBriefcase, FaGraduationCap,
    FaLaptopCode, FaWallet, FaStar, FaListUl, FaThLarge,
    FaFileExport, FaTrash
} from 'react-icons/fa';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell
} from 'recharts';

interface Achievement {
    id: number;
    title: string;
    category: string;
    description: string;
    achieved_year: number;
    created_at: string;
}

const Achievements = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    // States untuk UI
    const [filterCategory, setFilterCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

    const fetchAchievements = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const res = await fetch('http://localhost:5000/api/life/achievements', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();

            if (res.ok && result.success) {
                setAchievements(result.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, [navigate]);

    // --- ACTIONS ---
    const handleAddAchievement = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Tambah Achievement 🏆',
            html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Judul Pencapaian</label>
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg" placeholder="Misal: Lulus Teknik Informatika">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Kategori</label>
        <select id="swal-category" class="w-full p-3 mb-3 border rounded-lg bg-white">
          <option value="Career">Career (Karir)</option>
          <option value="Education">Education (Pendidikan)</option>
          <option value="Project">Project (Proyek)</option>
          <option value="Finance">Finance (Keuangan)</option>
          <option value="Personal">Personal (Pribadi)</option>
        </select>

        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tahun Pencapaian</label>
        <input id="swal-year" type="number" class="w-full p-3 mb-3 border rounded-lg" value="${new Date().getFullYear()}">
        
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Deskripsi Singkat</label>
        <textarea id="swal-desc" rows="3" class="w-full p-3 border rounded-lg resize-none" placeholder="Ceritakan detail pencapaian ini..."></textarea>
      `,
            showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#2563EB',
            preConfirm: () => {
                const title = (document.getElementById('swal-title') as HTMLInputElement).value;
                if (!title) { Swal.showValidationMessage('Judul wajib diisi!'); return false; }
                return {
                    title,
                    category: (document.getElementById('swal-category') as HTMLSelectElement).value,
                    achieved_year: parseInt((document.getElementById('swal-year') as HTMLInputElement).value),
                    description: (document.getElementById('swal-desc') as HTMLTextAreaElement).value
                };
            }
        });

        if (formValues) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/life/achievements', {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formValues)
                });
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: 'Achievement Dicatat!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
                    fetchAchievements();
                }
            } catch (err) { Swal.fire('Error', 'Gagal menyimpan', 'error'); }
        }
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({ title: 'Hapus Achievement?', text: 'Data tidak bisa dikembalikan.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
        if (confirm.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/life/achievements/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (res.ok) {
                    Swal.fire({ icon: 'success', title: 'Dihapus', toast: true, position: 'top-end', timer: 1000, showConfirmButton: false });
                    fetchAchievements();
                }
            } catch (e) { console.error(e); }
        }
    };

    // --- DATA PROCESSING & FILTERING ---
    const getCategoryConfig = (cat: string) => {
        switch (cat) {
            case 'Career': return { icon: <FaBriefcase />, color: 'blue' };
            case 'Education': return { icon: <FaGraduationCap />, color: 'emerald' };
            case 'Project': return { icon: <FaLaptopCode />, color: 'indigo' };
            case 'Finance': return { icon: <FaWallet />, color: 'amber' };
            case 'Personal': return { icon: <FaStar />, color: 'rose' };
            default: return { icon: <FaTrophy />, color: 'slate' };
        }
    };

    const filteredData = filterCategory === 'All' ? achievements : achievements.filter(a => a.category === filterCategory);

    // Group by Year for Timeline
    const groupedByYear = filteredData.reduce((acc, curr) => {
        if (!acc[curr.achieved_year]) acc[curr.achieved_year] = [];
        acc[curr.achieved_year].push(curr);
        return acc;
    }, {} as Record<number, Achievement[]>);

    const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

    // Chart Data: By Year
    const chartByYearMap: any = {};
    achievements.forEach(a => {
        chartByYearMap[a.achieved_year] = (chartByYearMap[a.achieved_year] || 0) + 1;
    });
    const chartByYear = Object.keys(chartByYearMap).map(year => ({ year, Total: chartByYearMap[year] })).sort((a, b) => Number(a.year) - Number(b.year));

    // Chart Data: By Category
    const chartByCategoryMap: any = {};
    achievements.forEach(a => {
        chartByCategoryMap[a.category] = (chartByCategoryMap[a.category] || 0) + 1;
    });
    const chartByCategory = Object.keys(chartByCategoryMap).map(cat => ({ name: cat, value: chartByCategoryMap[cat] }));
    const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#F43F5E'];

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-7xl mx-auto font-sans bg-[#F8FAFC] pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <FaTrophy className="text-amber-500" /> Achievements
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Dokumentasi perjalanan dan tonggak keberhasilan Anda.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <FaFileExport /> Export
                    </button>
                    <button onClick={handleAddAchievement} className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                        <FaPlus /> Add Achievement
                    </button>
                </div>
            </div>

            {/* 1️⃣ Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { title: "Total Milestone", val: achievements.length, icon: <FaTrophy />, color: "amber" },
                    { title: "Career", val: achievements.filter(a => a.category === 'Career').length, icon: <FaBriefcase />, color: "blue" },
                    { title: "Project", val: achievements.filter(a => a.category === 'Project').length, icon: <FaLaptopCode />, color: "indigo" },
                    { title: "Education", val: achievements.filter(a => a.category === 'Education').length, icon: <FaGraduationCap />, color: "emerald" },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
                            <h4 className="text-2xl font-black text-slate-800">{item.val}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kolom Kiri: Konten Utama (Timeline / Grid) */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Controls: Filter & View Toggle */}
                    <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['All', 'Career', 'Education', 'Project', 'Finance', 'Personal'].map(cat => (
                                <button
                                    key={cat} onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterCategory === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                            <button onClick={() => setViewMode('timeline')} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-400'}`}><FaListUl /></button>
                            <button onClick={() => setViewMode('grid')} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-400'}`}><FaThLarge /></button>
                        </div>
                    </div>

                    {/* 2️⃣ Main Content (Timeline Mode) */}
                    {viewMode === 'timeline' && (
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[500px]">
                            {sortedYears.length === 0 ? (
                                <div className="text-center text-slate-400 py-20 font-medium">Belum ada pencapaian di kategori ini.</div>
                            ) : (
                                <div className="space-y-10">
                                    {sortedYears.map(year => (
                                        <div key={year}>
                                            <h4 className="text-2xl font-black text-slate-300 mb-6 sticky top-0 bg-white py-2 z-10">{year}</h4>
                                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
                                                {groupedByYear[year].map(ach => {
                                                    const config = getCategoryConfig(ach.category);
                                                    return (
                                                        <div key={ach.id} className="relative pl-10 group">
                                                            {/* Node Bulat */}
                                                            <div className={`absolute -left-[19px] top-1 w-9 h-9 bg-white border-[3px] border-${config.color}-500 text-${config.color}-500 rounded-full flex items-center justify-center text-sm shadow-sm group-hover:scale-125 group-hover:bg-${config.color}-50 transition-all z-10`}>
                                                                {config.icon}
                                                            </div>

                                                            {/* Konten Achievement */}
                                                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl group-hover:shadow-lg group-hover:border-blue-200 transition-all relative overflow-hidden">
                                                                <div className={`absolute top-0 left-0 w-1.5 h-full bg-${config.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h5 className="font-bold text-slate-900 text-lg tracking-tight pr-8">{ach.title}</h5>
                                                                    <button onClick={() => handleDelete(ach.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><FaTrash size={12} /></button>
                                                                </div>

                                                                <span className={`inline-block px-3 py-1 bg-${config.color}-100 text-${config.color}-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3`}>
                                                                    {ach.category}
                                                                </span>

                                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{ach.description}</p>
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
                    )}

                    {/* 3️⃣ Main Content (Grid Mode) */}
                    {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredData.map(ach => {
                                const config = getCategoryConfig(ach.category);
                                return (
                                    <div key={ach.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${config.color}-50 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none`}></div>

                                        <div className="flex justify-between items-center mb-4 relative z-10">
                                            <div className={`w-10 h-10 bg-${config.color}-100 text-${config.color}-600 rounded-xl flex items-center justify-center text-lg`}>
                                                {config.icon}
                                            </div>
                                            <span className="font-black text-slate-300 text-xl">{ach.achieved_year}</span>
                                        </div>

                                        <span className={`inline-block w-max px-2 py-1 bg-${config.color}-50 text-${config.color}-600 border border-${config.color}-100 text-[10px] font-black uppercase tracking-widest rounded-md mb-3`}>
                                            {ach.category}
                                        </span>

                                        <h5 className="font-bold text-slate-900 text-lg leading-snug mb-3 flex-1">{ach.title}</h5>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-3 mb-4">{ach.description}</p>

                                        <button onClick={() => handleDelete(ach.id)} className="mt-auto w-full py-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl text-xs font-bold transition-colors">
                                            Hapus Pencapaian
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>

                {/* Kolom Kanan: Analytics Charts */}
                <div className="flex flex-col gap-6">

                    {/* Bar Chart: Progress per Year */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">📈 Timeline Statistik</h3>
                        <div className="h-48 w-full">
                            {chartByYear.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartByYear}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} allowDecimals={false} />
                                        <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="Total" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                            {chartByYear.map((_, i) => <Cell key={`cell-${i}`} fill="#3B82F6" />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <div className="h-full flex items-center justify-center text-slate-400 text-sm">Belum ada data.</div>}
                        </div>
                    </div>

                    {/* Pie Chart: Distribution by Category */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">🎯 Distribusi Kategori</h3>
                        <div className="h-56 w-full flex flex-col items-center">
                            {chartByCategory.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {chartByCategory.map((_, index) => <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                                        {chartByCategory.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                {entry.name} ({entry.value})
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : <div className="h-full flex items-center justify-center text-slate-400 text-sm">Belum ada data.</div>}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Achievements;