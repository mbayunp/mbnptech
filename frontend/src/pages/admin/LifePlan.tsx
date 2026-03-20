// src/pages/admin/LifePlan.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { 
  FaRocket, FaStar, FaGraduationCap, 
  FaBriefcase, FaMoneyBillWave, FaHeart, 
  FaMapMarkerAlt, FaEdit, FaPlus 
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

  // Visi statis
  const [vision] = useState({
    statement: "Menjadi pribadi yang unggul di bidang teknologi, berintegritas, dan bermanfaat bagi masyarakat melalui pengembangan sistem digital, pendidikan, serta kontribusi nyata dalam kemajuan teknologi dan data di Indonesia.",
    values: ["Mengembangkan Keahlian Teknologi Secara Berkelanjutan", "Membangun Karir Profesional yang Stabil dan Berdampak", "Melanjutkan Pendidikan untuk Memperluas Wawasan", "Membangun Stabilitas Keuangan dan Kemandirian"]
  });

  const fetchLifePlans = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch(`${API_URL}/api/life/plans`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (res.status === 401 || res.status === 403) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (result.success) setPlans(result.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLifePlans(); }, [navigate]);

  // --- 1. FUNGSI CREATE (TAMBAH DATA BARU) ---
  const handleAdd = async (category: string) => {
    const categoryTitles: any = {
      timeline: 'Timeline Baru', career: 'Target Karir Baru',
      education: 'Rencana Pendidikan', finance: 'Target Finansial', relationship: 'Rencana Hubungan'
    };

    const { value: formValues } = await Swal.fire({
      title: `Tambah ${categoryTitles[category]}`,
      html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Judul / Target</label>
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg" placeholder="Masukkan target...">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Deskripsi / Nominal (Opsional)</label>
        <input id="swal-desc" class="w-full p-3 mb-3 border rounded-lg" placeholder="Detail...">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Progress Awal (%)</label>
        <input id="swal-progress" type="number" min="0" max="100" class="w-full p-3 mb-3 border rounded-lg" value="0">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tahun Target</label>
        <input id="swal-year" type="number" class="w-full p-3 mb-3 border rounded-lg" placeholder="Misal: 2026">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Status</label>
        <select id="swal-status" class="w-full p-3 border rounded-lg bg-white">
          <option value="upcoming">Upcoming (Mendatang)</option>
          <option value="current">Current (Berjalan)</option>
          <option value="achieved">Achieved (Tercapai)</option>
        </select>
      `,
      focusConfirm: false, showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#2563EB',
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
      title: 'Update Life Plan',
      html: `
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Judul / Target</label>
        <input id="swal-title" class="w-full p-3 mb-3 border rounded-lg" value="${item.title}">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Deskripsi / Nominal</label>
        <input id="swal-desc" class="w-full p-3 mb-3 border rounded-lg" value="${item.description || ''}">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Progress (%)</label>
        <input id="swal-progress" type="number" min="0" max="100" class="w-full p-3 mb-3 border rounded-lg" value="${item.progress}">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Tahun Target</label>
        <input id="swal-year" type="number" class="w-full p-3 mb-3 border rounded-lg" value="${item.target_year || ''}">
        <label class="block text-left text-xs font-bold text-slate-500 mb-1">Status</label>
        <select id="swal-status" class="w-full p-3 border rounded-lg bg-white">
          <option value="upcoming" ${item.status === 'upcoming' ? 'selected' : ''}>Upcoming (Mendatang)</option>
          <option value="current" ${item.status === 'current' ? 'selected' : ''}>Current (Berjalan)</option>
          <option value="achieved" ${item.status === 'achieved' ? 'selected' : ''}>Achieved (Tercapai)</option>
        </select>
      `,
      showCancelButton: true, showDenyButton: true, // Tombol Hapus Merah
      confirmButtonText: 'Update', denyButtonText: 'Hapus', confirmButtonColor: '#2563EB', denyButtonColor: '#ef4444',
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

    // Jika Klik Update (Biru)
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
      const confirmDelete = await Swal.fire({ title: 'Yakin Hapus?', text: "Data ini tidak bisa dikembalikan.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
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
  const relationships = plans.filter(p => p.category === 'relationship'); // Sekarang Dinamis!

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Life Planning</h2>
        <p className="text-slate-500 mt-1 text-sm font-medium">Roadmap dan kompas perjalanan hidup jangka panjang Anda.</p>
      </div>

      {/* 1️⃣ Life Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 rounded-[2rem] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6 backdrop-blur-sm border border-white/10"><FaRocket /></div>
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-widest mb-2">Visi Hidup</h3>
            <p className="text-xl md:text-2xl font-black leading-snug tracking-tight mb-0">"{vision.statement}"</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FaStar className="text-amber-400" /> Nilai Inti</h3>
          <ul className="space-y-4">
            {vision.values.map((val, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-700 font-bold text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs shrink-0">{idx + 1}</div>{val}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2️⃣ Life Timeline */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-6 overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Timeline Perjalanan</h3>
          <button onClick={() => handleAdd('timeline')} className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-colors" title="Tambah Timeline"><FaPlus className="text-sm" /></button>
        </div>
        <div className="flex items-center min-w-[800px] relative pb-4">
          <div className="absolute left-0 right-0 top-6 h-1 bg-slate-100 rounded-full -z-10"></div>
          {timelines.length === 0 ? <div className="text-slate-400 text-sm italic py-4">Belum ada timeline ditambahkan.</div> : timelines.map((item) => (
            <div key={item.id} className="flex-1 relative group cursor-pointer" onClick={() => handleEdit(item)}>
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 border-4 ${item.status === 'current' ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-500/30 scale-110' : item.status === 'achieved' ? 'bg-emerald-500 text-white border-emerald-100' : 'bg-white text-slate-400 border-slate-100 group-hover:border-blue-300'}`}>
                {item.target_year || '-'}
              </div>
              <div className="mt-4 text-center px-2 relative">
                <p className={`text-xs font-bold ${item.status === 'current' ? 'text-blue-600' : 'text-slate-600'}`}>{item.title}</p>
                <div className="absolute -top-12 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white p-1.5 rounded-md text-[10px]"><FaEdit /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* 3️⃣ Career Planning */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaBriefcase className="text-indigo-500" /> Career Planning</h3>
            <button onClick={() => handleAdd('career')} className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl hover:bg-indigo-100 transition-colors" title="Tambah Karir"><FaPlus className="text-sm" /></button>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto">
            {careers.length === 0 ? <p className="text-slate-400 text-sm">Belum ada target karir.</p> : careers.map((career) => (
              <div key={career.id} className="group cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors" onClick={() => handleEdit(career)}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 flex items-center gap-2">{career.title} <FaEdit className="text-indigo-300 opacity-0 group-hover:opacity-100" /></h4>
                    {career.description && <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{career.description}</p>}
                  </div>
                  <span className="text-xs font-black text-indigo-600">{career.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${career.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* 4️⃣ Education Planning */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaGraduationCap className="text-emerald-500" /> Education Planning</h3>
            <button onClick={() => handleAdd('education')} className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl hover:bg-emerald-100 transition-colors" title="Tambah Pendidikan"><FaPlus className="text-sm" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {educations.length === 0 ? <p className="text-slate-400 text-sm">Belum ada target pendidikan.</p> : educations.map(edu => (
              <div key={edu.id} onClick={() => handleEdit(edu)} className="bg-emerald-50/50 hover:bg-emerald-50 p-5 rounded-2xl border border-emerald-100 cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">Target <FaEdit className="opacity-0 group-hover:opacity-100 text-emerald-400" /></p>
                  {edu.target_year && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{edu.target_year}</span>}
                </div>
                <h4 className="text-lg font-black text-emerald-900 leading-tight mb-2">{edu.title}</h4>
                <p className="text-xs text-slate-600 font-medium mb-3">{edu.description}</p>
                <div className="w-full bg-emerald-100 rounded-full h-1.5"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${edu.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 5️⃣ Financial Planning */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaMoneyBillWave className="text-amber-500" /> Financial Goals</h3>
            <button onClick={() => handleAdd('finance')} className="bg-amber-50 text-amber-600 p-2.5 rounded-xl hover:bg-amber-100 transition-colors" title="Tambah Finansial"><FaPlus className="text-sm" /></button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {finances.length === 0 ? <p className="text-slate-400 text-sm">Belum ada target finansial.</p> : finances.map(fin => (
              <div key={fin.id} className="group cursor-pointer bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-amber-200 transition-colors" onClick={() => handleEdit(fin)}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">{fin.title} <FaEdit className="text-amber-300 opacity-0 group-hover:opacity-100" /></h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{fin.description}</p>
                  </div>
                  <span className="text-xs font-black text-amber-600">{fin.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${fin.progress}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* 6️⃣ Relationship & Family */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><FaHeart className="text-rose-500" /> Family & Relationship</h3>
            <button onClick={() => handleAdd('relationship')} className="bg-rose-50 text-rose-600 p-2.5 rounded-xl hover:bg-rose-100 transition-colors" title="Tambah Relationship"><FaPlus className="text-sm" /></button>
          </div>
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
             {relationships.length === 0 ? (
                <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl flex flex-col justify-center text-center h-full">
                  <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl text-rose-200 shadow-sm mb-4">💍</div>
                  <p className="text-sm text-rose-400 font-medium">Belum ada target relationship ditambahkan.</p>
                </div>
             ) : relationships.map(rel => (
                <div key={rel.id} onClick={() => handleEdit(rel)} className="bg-rose-50 border border-rose-100 p-5 rounded-2xl cursor-pointer group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-base font-black text-rose-900 group-hover:text-rose-600 flex items-center gap-2">{rel.title} <FaEdit className="text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                    {rel.target_year && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{rel.target_year}</span>}
                  </div>
                  <p className="text-xs text-rose-700/80 font-medium leading-relaxed">{rel.description}</p>
                </div>
             ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default LifePlan;