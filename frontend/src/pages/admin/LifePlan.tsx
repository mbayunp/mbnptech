// src/pages/admin/LifePlan.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { 
  FaRocket, FaStar, FaGraduationCap, 
  FaBriefcase, FaMoneyBillWave, FaHeart, 
  FaMapMarkerAlt, FaEdit, FaPlus, FaBullseye, FaQuoteLeft 
} from 'react-icons/fa';

interface LifePlanData {
  id: number;
  category: string;
  title: string;
  description: string;
  progress: number;
  target_year: number | null;
  status: string;
}

const LifePlan = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<LifePlanData[]>([]);

  // State Dinamis Visi Misi
  const [vision, setVision] = useState({
    statement: "Menjadi pribadi yang unggul di bidang teknologi, berintegritas, dan bermanfaat bagi masyarakat melalui pengembangan sistem digital, pendidikan, serta kontribusi nyata dalam kemajuan teknologi dan data di Indonesia.",
    values: [
      "Mengembangkan Keahlian Teknologi Secara Berkelanjutan", 
      "Membangun Karir Profesional yang Stabil dan Berdampak", 
      "Melanjutkan Pendidikan untuk Memperluas Wawasan", 
      "Membangun Stabilitas Keuangan dan Kemandirian"
    ]
  });

  const fetchLifePlans = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      // Ambil data Plans
      const res = await fetch(`${API_URL}/api/life/plans`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (res.status === 401 || res.status === 403) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (result.success) setPlans(result.data);

      // Ambil data Vision (Jika API ini nanti dibuat di backend)
      const resVision = await fetch(`${API_URL}/api/life/vision`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (resVision.ok) {
        const resultVision = await resVision.json();
        if (resultVision.success && resultVision.data) {
          setVision({
            statement: resultVision.data.statement,
            values: JSON.parse(resultVision.data.values) // Asumsi values disimpan sebagai JSON string di DB
          });
        }
      }

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLifePlans(); }, [navigate]);

  // --- FUNGSI UPDATE VISI MISI ---
  const handleEditVision = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Visi & Misi',
      html: `
        <div class="text-left font-sans">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visi Hidup Utama</label>
          <textarea id="swal-statement" rows="4" class="w-full p-4 mb-4 border-2 border-slate-100 rounded-[1rem] bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700">${vision.statement}</textarea>
          
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nilai Inti (Pisahkan dengan Koma)</label>
          <textarea id="swal-values" rows="4" class="w-full p-4 mb-2 border-2 border-slate-100 rounded-[1rem] bg-slate-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-slate-600">${vision.values.join(',\n')}</textarea>
        </div>
      `,
      showCancelButton: true, confirmButtonText: 'Simpan', cancelButtonText: 'Batal', confirmButtonColor: '#2563EB',
      customClass: { popup: 'rounded-[2rem] p-6' },
      preConfirm: () => {
        const statement = (document.getElementById('swal-statement') as HTMLTextAreaElement).value;
        const rawValues = (document.getElementById('swal-values') as HTMLTextAreaElement).value;
        const valuesArray = rawValues.split(',').map(v => v.trim()).filter(v => v !== '');
        
        if (!statement) { Swal.showValidationMessage('Visi tidak boleh kosong!'); return false; }
        return { statement, values: JSON.stringify(valuesArray) };
      }
    });

    if (formValues) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/life/vision`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formValues)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Visi Diperbarui!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
          fetchLifePlans(); // Refresh data
        }
      } catch (err) { Swal.fire('Error', 'Gagal memperbarui visi', 'error'); }
    }
  };

  // --- 1. FUNGSI CREATE (TAMBAH DATA BARU) ---
  const handleAdd = async (category: string) => {
    const categoryTitles: any = {
      timeline: 'Timeline Baru', career: 'Target Karir',
      education: 'Pendidikan', finance: 'Target Finansial', relationship: 'Hubungan'
    };

    const { value: formValues } = await Swal.fire({
      title: `Tambah ${categoryTitles[category]}`,
      html: `
        <div class="text-left font-sans">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Judul / Target</label>
          <input id="swal-title" class="w-full p-4 mb-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-bold" placeholder="Misal: Lulus S2 Jepang">
          
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi (Opsional)</label>
          <input id="swal-desc" class="w-full p-4 mb-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 text-sm" placeholder="Detail target...">
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Progress (%)</label>
              <input id="swal-progress" type="number" min="0" max="100" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-black text-center" value="0">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tahun Target</label>
              <input id="swal-year" type="number" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-black text-center" value="${new Date().getFullYear() + 1}">
            </div>
          </div>
          
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
          <select id="swal-status" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-bold text-slate-700">
            <option value="upcoming">🗓️ Upcoming (Mendatang)</option>
            <option value="current">🚀 Current (Berjalan)</option>
            <option value="achieved">✅ Achieved (Tercapai)</option>
          </select>
        </div>
      `,
      focusConfirm: false, showCancelButton: true, confirmButtonText: 'Simpan', cancelButtonText: 'Batal', confirmButtonColor: '#2563EB',
      customClass: { popup: 'rounded-[2rem] p-6' },
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        if (!title) { Swal.showValidationMessage('Judul wajib diisi!'); return false; }
        return {
          category, title,
          description: (document.getElementById('swal-desc') as HTMLInputElement).value,
          progress: parseInt((document.getElementById('swal-progress') as HTMLInputElement).value) || 0,
          target_year: parseInt((document.getElementById('swal-year') as HTMLInputElement).value) || null,
          status: (document.getElementById('swal-status') as HTMLSelectElement).value
        };
      }
    });

    if (formValues) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/life/plans`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formValues)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Berhasil ditambahkan!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
          fetchLifePlans();
        }
      } catch (err) { Swal.fire('Error', 'Gagal menambah data', 'error'); }
    }
  };

  // --- 2. FUNGSI UPDATE & DELETE ---
  const handleEdit = async (item: LifePlanData) => {
    const result = await Swal.fire({
      title: 'Update Target',
      html: `
        <div class="text-left font-sans">
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Judul / Target</label>
          <input id="swal-title" class="w-full p-4 mb-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-bold" value="${item.title}">
          
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi</label>
          <input id="swal-desc" class="w-full p-4 mb-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 text-sm" value="${item.description || ''}">
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Progress (%)</label>
              <input id="swal-progress" type="number" min="0" max="100" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-black text-center text-blue-600" value="${item.progress}">
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tahun Target</label>
              <input id="swal-year" type="number" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-black text-center" value="${item.target_year || ''}">
            </div>
          </div>
          
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
          <select id="swal-status" class="w-full p-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 bg-slate-50 font-bold text-slate-700">
            <option value="upcoming" ${item.status === 'upcoming' ? 'selected' : ''}>🗓️ Upcoming (Mendatang)</option>
            <option value="current" ${item.status === 'current' ? 'selected' : ''}>🚀 Current (Berjalan)</option>
            <option value="achieved" ${item.status === 'achieved' ? 'selected' : ''}>✅ Achieved (Tercapai)</option>
          </select>
        </div>
      `,
      showCancelButton: true, showDenyButton: true,
      confirmButtonText: 'Simpan', denyButtonText: 'Hapus', cancelButtonText: 'Batal',
      confirmButtonColor: '#2563EB', denyButtonColor: '#ef4444',
      customClass: { popup: 'rounded-[2rem] p-6' },
      preConfirm: () => {
        return {
          title: (document.getElementById('swal-title') as HTMLInputElement).value,
          description: (document.getElementById('swal-desc') as HTMLInputElement).value,
          progress: parseInt((document.getElementById('swal-progress') as HTMLInputElement).value) || 0,
          target_year: parseInt((document.getElementById('swal-year') as HTMLInputElement).value) || null,
          status: (document.getElementById('swal-status') as HTMLSelectElement).value
        };
      }
    });

    const token = localStorage.getItem('token');

    // Jika Klik Simpan (Biru)
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/life/plans/${item.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(result.value)
        });
        if (res.ok) { Swal.fire({ icon: 'success', title: 'Diperbarui!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchLifePlans(); }
      } catch (err) { Swal.fire('Error', 'Gagal memperbarui', 'error'); }
    } 
    // Jika Klik Hapus (Merah)
    else if (result.isDenied) {
      const confirmDelete = await Swal.fire({ title: 'Yakin Hapus?', text: "Data target ini akan hilang.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
      if (confirmDelete.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/api/life/plans/${item.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) { Swal.fire({ icon: 'success', title: 'Dihapus!', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchLifePlans(); }
        } catch (err) { Swal.fire('Error', 'Gagal menghapus', 'error'); }
      }
    }
  };

  // --- FILTER DATA ---
  const timelines = plans.filter(p => p.category === 'timeline').sort((a, b) => (a.target_year || 0) - (b.target_year || 0));
  const careers = plans.filter(p => p.category === 'career');
  const educations = plans.filter(p => p.category === 'education');
  const finances = plans.filter(p => p.category === 'finance');
  const relationships = plans.filter(p => p.category === 'relationship');

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20 selection:bg-blue-200 selection:text-blue-900">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Life Blueprint</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Arsitektur perjalanan hidup dan masterplan jangka panjang Anda.</p>
        </div>
      </div>

      {/* 1️⃣ Life Vision (Masa Depan yang Lebih Elegan) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        
        {/* Banner Visi Utama */}
        <div className="lg:col-span-3 bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10 shrink-0">
              <FaBullseye className="text-blue-400" />
            </div>
            <button onClick={handleEditVision} className="p-3 bg-white/5 hover:bg-white/20 rounded-xl transition-all border border-white/10 text-white/50 hover:text-white" title="Edit Visi & Misi">
              <FaEdit />
            </button>
          </div>

          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><FaQuoteLeft className="text-white/20"/> Visi Hidup Utama</h3>
            <p className="text-xl md:text-3xl font-black leading-[1.3] tracking-tight text-white mb-2 line-clamp-4 group-hover:line-clamp-none transition-all">"{vision.statement}"</p>
          </div>
        </div>

        {/* Nilai Inti */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><FaStar className="text-amber-400 text-lg" /> Nilai Inti (Misi)</h3>
            <button onClick={handleEditVision} className="text-xs font-bold text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {vision.values.map((val, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{idx + 1}</div>
                <p className="text-sm font-bold text-slate-700 leading-snug pt-1 group-hover:text-slate-900 transition-colors">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2️⃣ Life Timeline (Journey) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8 overflow-x-auto custom-scrollbar relative">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaMapMarkerAlt className="text-rose-500" /> Milestone Timeline</h3>
          <button onClick={() => handleAdd('timeline')} className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-2 shadow-sm"><FaPlus /> Tambah Milestone</button>
        </div>
        
        <div className="flex items-center min-w-[800px] relative pb-6 pt-4">
          {/* Garis Horizontal */}
          <div className="absolute left-0 right-0 top-[26px] h-1.5 bg-slate-100 rounded-full -z-10"></div>
          
          {timelines.length === 0 ? <div className="text-slate-400 text-sm font-medium py-4 mx-auto">Milestone perjalanan belum dibuat.</div> : timelines.map((item) => (
            <div key={item.id} className="flex-1 relative group cursor-pointer" onClick={() => handleEdit(item)}>
              {/* Bulatan Tahun */}
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 border-[5px] ${
                item.status === 'current' ? 'bg-blue-600 text-white border-blue-100 shadow-xl shadow-blue-500/40 scale-[1.15] z-10 relative' 
                : item.status === 'achieved' ? 'bg-emerald-500 text-white border-emerald-100' 
                : 'bg-white text-slate-400 border-slate-200 group-hover:border-blue-300'
              }`}>
                {item.target_year || '-'}
              </div>
              
              {/* Tooltip Judul */}
              <div className="mt-5 text-center px-3 relative">
                <p className={`text-xs font-black ${item.status === 'current' ? 'text-blue-700' : 'text-slate-600'}`}>{item.title}</p>
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg whitespace-nowrap z-20 flex items-center gap-1">
                  <FaEdit className="text-blue-300"/> Edit Target
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3️⃣ Kategori Spesifik (Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Kolom 1: Career */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2"><FaBriefcase className="text-indigo-500 text-xl" /> Karir</h3>
            <button onClick={() => handleAdd('career')} className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors" title="Tambah Karir"><FaPlus className="text-xs" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {careers.length === 0 ? <p className="text-slate-400 text-xs font-medium bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">Belum ada target.</p> : careers.map((career) => (
              <div key={career.id} className="group cursor-pointer bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-300 transition-all hover:bg-white hover:shadow-sm" onClick={() => handleEdit(career)}>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    {career.target_year && <span className="text-[9px] font-black text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded uppercase tracking-widest mb-1.5 inline-block">{career.target_year}</span>}
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-700 leading-snug">{career.title}</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">{career.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${career.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 2: Education */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2"><FaGraduationCap className="text-emerald-500 text-xl" /> Pendidikan</h3>
            <button onClick={() => handleAdd('education')} className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" title="Tambah Pendidikan"><FaPlus className="text-xs" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {educations.length === 0 ? <p className="text-slate-400 text-xs font-medium bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">Belum ada target.</p> : educations.map(edu => (
              <div key={edu.id} onClick={() => handleEdit(edu)} className="group cursor-pointer bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-emerald-300 transition-all hover:bg-white hover:shadow-sm">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    {edu.target_year && <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-widest mb-1.5 inline-block">{edu.target_year}</span>}
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-emerald-700 leading-snug">{edu.title}</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">{edu.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${edu.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 3: Finance */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2"><FaMoneyBillWave className="text-amber-500 text-xl" /> Finansial</h3>
            <button onClick={() => handleAdd('finance')} className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors" title="Tambah Finansial"><FaPlus className="text-xs" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {finances.length === 0 ? <p className="text-slate-400 text-xs font-medium bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">Belum ada target.</p> : finances.map(fin => (
              <div key={fin.id} className="group cursor-pointer bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-amber-300 transition-all hover:bg-white hover:shadow-sm" onClick={() => handleEdit(fin)}>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    {fin.target_year && <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-widest mb-1.5 inline-block">{fin.target_year}</span>}
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 leading-snug">{fin.title}</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">{fin.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: `${fin.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 4: Relationship */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2"><FaHeart className="text-rose-500 text-xl" /> Hubungan</h3>
            <button onClick={() => handleAdd('relationship')} className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors" title="Tambah Hubungan"><FaPlus className="text-xs" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {relationships.length === 0 ? <p className="text-slate-400 text-xs font-medium bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">Belum ada target.</p> : relationships.map(rel => (
                <div key={rel.id} onClick={() => handleEdit(rel)} className="group cursor-pointer bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-rose-300 transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div>
                      {rel.target_year && <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-widest mb-1.5 inline-block">{rel.target_year}</span>}
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-rose-600 leading-snug">{rel.title}</h4>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shrink-0">{rel.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden"><div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${rel.progress}%` }}></div></div>
                </div>
             ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default LifePlan;