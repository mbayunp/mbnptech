// src/pages/admin/Spiritual.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { 
  FaMoon, FaBookOpen, FaPrayingHands, FaHeart, 
  FaChartPie, FaCheckCircle, FaRegCircle, FaPlus, 
  FaTrash, FaStar, FaLeaf, FaMosque, FaTimes, FaClock, 
  FaMapMarkerAlt, FaCalendarCheck
} from 'react-icons/fa';

// --- DATA 114 SURAH ---
const quranSurahs = [
  { no: 1, name: "Al-Fatihah", ayat: 7 }, { no: 2, name: "Al-Baqarah", ayat: 286 }, { no: 3, name: "Ali 'Imran", ayat: 200 }, { no: 4, name: "An-Nisa'", ayat: 176 },
  { no: 5, name: "Al-Ma'idah", ayat: 120 }, { no: 6, name: "Al-An'am", ayat: 165 }, { no: 7, name: "Al-A'raf", ayat: 206 }, { no: 8, name: "Al-Anfal", ayat: 75 },
  { no: 9, name: "At-Taubah", ayat: 129 }, { no: 10, name: "Yunus", ayat: 109 }, { no: 11, name: "Hud", ayat: 123 }, { no: 12, name: "Yusuf", ayat: 111 },
  { no: 13, name: "Ar-Ra'd", ayat: 43 }, { no: 14, name: "Ibrahim", ayat: 52 }, { no: 15, name: "Al-Hijr", ayat: 99 }, { no: 16, name: "An-Nahl", ayat: 128 },
  { no: 17, name: "Al-Isra'", ayat: 111 }, { no: 18, name: "Al-Kahf", ayat: 110 }, { no: 19, name: "Maryam", ayat: 98 }, { no: 20, name: "Taha", ayat: 135 },
  { no: 21, name: "Al-Anbiya'", ayat: 112 }, { no: 22, name: "Al-Hajj", ayat: 78 }, { no: 23, name: "Al-Mu'minun", ayat: 118 }, { no: 24, name: "An-Nur", ayat: 64 },
  { no: 25, name: "Al-Furqan", ayat: 77 }, { no: 26, name: "Asy-Syu'ara'", ayat: 227 }, { no: 27, name: "An-Naml", ayat: 93 }, { no: 28, name: "Al-Qasas", ayat: 88 },
  { no: 29, name: "Al-'Ankabut", ayat: 69 }, { no: 30, name: "Ar-Rum", ayat: 60 }, { no: 31, name: "Luqman", ayat: 34 }, { no: 32, name: "As-Sajdah", ayat: 30 },
  { no: 33, name: "Al-Ahzab", ayat: 73 }, { no: 34, name: "Saba'", ayat: 54 }, { no: 35, name: "Fatir", ayat: 45 }, { no: 36, name: "Ya Sin", ayat: 83 },
  { no: 37, name: "As-Saffat", ayat: 182 }, { no: 38, name: "Sad", ayat: 88 }, { no: 39, name: "Az-Zumar", ayat: 75 }, { no: 40, name: "Gafir", ayat: 85 },
  { no: 41, name: "Fussilat", ayat: 54 }, { no: 42, name: "Asy-Syura", ayat: 53 }, { no: 43, name: "Az-Zukhruf", ayat: 89 }, { no: 44, name: "Ad-Dukhan", ayat: 59 },
  { no: 45, name: "Al-Jasiyah", ayat: 37 }, { no: 46, name: "Al-Ahqaf", ayat: 35 }, { no: 47, name: "Muhammad", ayat: 38 }, { no: 48, name: "Al-Fath", ayat: 29 },
  { no: 49, name: "Al-Hujurat", ayat: 18 }, { no: 50, name: "Qaf", ayat: 45 }, { no: 51, name: "Az-Zariyat", ayat: 60 }, { no: 52, name: "At-Tur", ayat: 49 },
  { no: 53, name: "An-Najm", ayat: 62 }, { no: 54, name: "Al-Qamar", ayat: 55 }, { no: 55, name: "Ar-Rahman", ayat: 78 }, { no: 56, name: "Al-Waqi'ah", ayat: 96 },
  { no: 57, name: "Al-Hadid", ayat: 29 }, { no: 58, name: "Al-Mujadalah", ayat: 22 }, { no: 59, name: "Al-Hasyr", ayat: 24 }, { no: 60, name: "Al-Mumtahanah", ayat: 13 },
  { no: 61, name: "As-Saff", ayat: 14 }, { no: 62, name: "Al-Jumu'ah", ayat: 11 }, { no: 63, name: "Al-Munafiqun", ayat: 11 }, { no: 64, name: "At-Tagabun", ayat: 18 },
  { no: 65, name: "At-Talaq", ayat: 12 }, { no: 66, name: "At-Tahrim", ayat: 12 }, { no: 67, name: "Al-Mulk", ayat: 30 }, { no: 68, name: "Al-Qalam", ayat: 52 },
  { no: 69, name: "Al-Haqqah", ayat: 52 }, { no: 70, name: "Al-Ma'arij", ayat: 44 }, { no: 71, name: "Nuh", ayat: 28 }, { no: 72, name: "Al-Jinn", ayat: 28 },
  { no: 73, name: "Al-Muzzammil", ayat: 20 }, { no: 74, name: "Al-Muddassir", ayat: 56 }, { no: 75, name: "Al-Qiyamah", ayat: 40 }, { no: 76, name: "Al-Insan", ayat: 31 },
  { no: 77, name: "Al-Mursalat", ayat: 50 }, { no: 78, name: "An-Naba'", ayat: 40 }, { no: 79, name: "An-Nazi'at", ayat: 46 }, { no: 80, name: "'Abasa", ayat: 42 },
  { no: 81, name: "At-Takwir", ayat: 29 }, { no: 82, name: "Al-Infitar", ayat: 19 }, { no: 83, name: "Al-Mutaffifin", ayat: 36 }, { no: 84, name: "Al-Insyiqaq", ayat: 25 },
  { no: 85, name: "Al-Buruj", ayat: 22 }, { no: 86, name: "At-Tariq", ayat: 17 }, { no: 87, name: "Al-A'la", ayat: 19 }, { no: 88, name: "Al-Gasyiyah", ayat: 26 },
  { no: 89, name: "Al-Fajr", ayat: 30 }, { no: 90, name: "Al-Balad", ayat: 20 }, { no: 91, name: "Asy-Syams", ayat: 15 }, { no: 92, name: "Al-Lail", ayat: 21 },
  { no: 93, name: "Ad-Duha", ayat: 11 }, { no: 94, name: "Asy-Syarh", ayat: 8 }, { no: 95, name: "At-Tin", ayat: 8 }, { no: 96, name: "Al-'Alaq", ayat: 19 },
  { no: 97, name: "Al-Qadr", ayat: 5 }, { no: 98, name: "Al-Bayyinah", ayat: 8 }, { no: 99, name: "Az-Zalzalah", ayat: 8 }, { no: 100, name: "Al-'Adiyat", ayat: 11 },
  { no: 101, name: "Al-Qari'ah", ayat: 11 }, { no: 102, name: "At-Takasur", ayat: 8 }, { no: 103, name: "Al-'Asr", ayat: 3 }, { no: 104, name: "Al-Humazah", ayat: 9 },
  { no: 105, name: "Al-Fil", ayat: 5 }, { no: 106, name: "Quraisy", ayat: 4 }, { no: 107, name: "Al-Ma'un", ayat: 7 }, { no: 108, name: "Al-Kausar", ayat: 3 },
  { no: 109, name: "Al-Kafirun", ayat: 6 }, { no: 110, name: "An-Nasr", ayat: 3 }, { no: 111, name: "Al-Lahab", ayat: 5 }, { no: 112, name: "Al-Ikhlas", ayat: 4 },
  { no: 113, name: "Al-Falaq", ayat: 5 }, { no: 114, name: "An-Nas", ayat: 6 }
];

const CITIES = { 'Garut': '1208', 'Bandung': '1219', 'Cianjur': '1205' };

// HELPER: Memaksa Date menggunakan zona waktu lokal (Asia/Jakarta)
const getLocalDateString = (d: Date) => {
  // Format en-CA secara otomatis menghasilkan YYYY-MM-DD
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
};

const Spiritual = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Memaksa tampilan tanggal menggunakan Waktu Indonesia (WIB)
  const [currentDate] = useState(new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' 
  }));
  
  const [ibadah, setIbadah] = useState<any>({});
  const [quran, setQuran] = useState<any>({});
  const [amalan, setAmalan] = useState<any>({});
  const [doaList, setDoaList] = useState<any[]>([]);
  const [reflection, setReflection] = useState<any>({ gratitude: '', mistake: '', improvement: '', mood: '' });
  const [history, setHistory] = useState<any[]>([]); 
  
  const [showDoaRec, setShowDoaRec] = useState(false);
  const [isQuranModalOpen, setIsQuranModalOpen] = useState(false);

  const [editSurah, setEditSurah] = useState('Al-Baqarah');
  const [editAyat, setEditAyat] = useState(1);
  const [editPage, setEditPage] = useState(1);
  const [editJuz, setEditJuz] = useState(1);

  const [selectedCity, setSelectedCity] = useState<keyof typeof CITIES>(() => {
    return (localStorage.getItem('mbnp_city') as keyof typeof CITIES) || 'Garut';
  });
  const [prayerTimes, setPrayerTimes] = useState<any>(null);

  const checkTimeReminders = (currentIbadah: any, currentAmalan: any) => {
    const now = new Date();
    // Gunakan jam lokal
    const hour = parseInt(now.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }));

    if (hour >= 5 && hour < 6 && !sessionStorage.getItem('reminder_subuh_done')) {
      if (!currentIbadah.subuh || !currentAmalan.dzikir_pagi) {
        Swal.fire({
          title: 'Selamat Pagi, Bayu! 🌅',
          text: 'Sudahkah Anda melaksanakan sholat Subuh dan Dzikir Pagi hari ini?',
          icon: 'question',
          showCancelButton: true, confirmButtonText: 'Sudah, Alhamdulillah', cancelButtonText: 'Belum', confirmButtonColor: '#10B981',
        }).then((res) => {
          if (res.isConfirmed) {
            if(!currentIbadah.subuh) handleToggleIbadah('subuh');
            if(!currentAmalan.dzikir_pagi) handleToggleAmalan('dzikir_pagi');
          }
          sessionStorage.setItem('reminder_subuh_done', 'true');
        });
      }
    }

    if (hour >= 6 && hour < 11 && !sessionStorage.getItem('reminder_dhuha_done')) {
      if (!currentIbadah.dhuha) {
        Swal.fire({
          title: 'Waktu Dhuha 🌤️',
          text: 'Sudahkah menyempatkan waktu untuk sholat Dhuha hari ini?',
          icon: 'info',
          showCancelButton: true, confirmButtonText: 'Sudah, Tandai Selesai', cancelButtonText: 'Nanti Dulu', confirmButtonColor: '#3B82F6',
        }).then((res) => {
          if (res.isConfirmed) handleToggleIbadah('dhuha');
          sessionStorage.setItem('reminder_dhuha_done', 'true');
        });
      }
    }

    if (hour === 0 || hour === 1) {
      sessionStorage.removeItem('reminder_subuh_done');
      sessionStorage.removeItem('reminder_dhuha_done');
    }
  };

  const fetchSpiritualData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await fetch(`${API_URL}/api/spiritual`, { headers: { 'Authorization': `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) {
        setIbadah(result.data.ibadah);
        setAmalan(result.data.amalan);
        setQuran(result.data.quran);
        setDoaList(result.data.doa);
        setReflection(result.data.reflection);
        if (result.data.history) setHistory(result.data.history);
        checkTimeReminders(result.data.ibadah, result.data.amalan);
      }
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const fetchPrayerTimes = async (city: keyof typeof CITIES) => {
    try {
      // Ambil format YYYY/MM/DD menggunakan zona waktu Jakarta
      const dateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }).replace(/-/g, '/');

      const cityId = CITIES[city];
      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${dateStr}`);
      const data = await response.json();
      if(data.status) setPrayerTimes(data.data.jadwal);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { 
    fetchSpiritualData(); 
    fetchPrayerTimes(selectedCity);
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value as keyof typeof CITIES;
    setSelectedCity(city);
    localStorage.setItem('mbnp_city', city);
    fetchPrayerTimes(city);
  };

  const handleToggleIbadah = async (field: string) => {
    const isCurrentlyDone = ibadah[field] === 1 || ibadah[field] === true;
    setIbadah((prev:any) => ({ ...prev, [field]: !isCurrentlyDone }));
    
    if (!isCurrentlyDone && ['subuh','dzuhur','ashar','maghrib','isya'].includes(field)) {
      setShowDoaRec(true); setTimeout(() => setShowDoaRec(false), 10000);
    }
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/spiritual/ibadah`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ field })
    });
    fetchSpiritualData();
  };

  const handleToggleAmalan = async (field: string) => {
    const isCurrentlyDone = amalan[field] === 1 || amalan[field] === true;
    setAmalan((prev:any) => ({ ...prev, [field]: !isCurrentlyDone }));
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/spiritual/amalan`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ field })
    });
    fetchSpiritualData();
  };

  const handleSaveQuran = async () => {
    const token = localStorage.getItem('token');
    const newQuran = { surah: editSurah, ayat: editAyat, page: editPage, juz: editJuz };
    setQuran(newQuran); setIsQuranModalOpen(false);
    await fetch(`${API_URL}/api/spiritual/quran`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newQuran)
    });
    Swal.fire({ icon: 'success', title: 'Bacaan Disimpan', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
  };

  const handleReflectionChange = async (key: string, value: string) => {
    const newRef = { ...reflection, [key]: value };
    setReflection(newRef);
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/spiritual/reflection`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newRef)
    });
  };

  const handleAddDoa = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tambah Doa',
      html: `
        <input id="doa-title" class="w-full p-3 mb-3 border rounded-lg outline-none font-bold" placeholder="Judul Doa">
        <input id="doa-cat" class="w-full p-3 mb-3 border rounded-lg outline-none font-medium" placeholder="Kategori (Misal: Rezeki, Harian)">
        <textarea id="doa-content" class="w-full p-3 border rounded-lg outline-none" rows="4" placeholder="Isi Doa..."></textarea>
      `,
      showCancelButton: true, confirmButtonText: 'Simpan', confirmButtonColor: '#6366F1',
      preConfirm: () => ({
        title: (document.getElementById('doa-title') as HTMLInputElement).value,
        category: (document.getElementById('doa-cat') as HTMLInputElement).value,
        content: (document.getElementById('doa-content') as HTMLTextAreaElement).value
      })
    });
    if (formValues && formValues.title) {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/spiritual/doa`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formValues)
      });
      fetchSpiritualData();
    }
  };

  const handleDeleteDoa = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/spiritual/doa/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
    fetchSpiritualData();
  };

  const sholatWajib = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const completedSholat = sholatWajib.filter(k => ibadah[k]).length;
  const dbAmalanFields = ['dzikir_pagi', 'dzikir_petang', 'istighfar', 'sholawat', 'sedekah'];
  const completedAmalan = dbAmalanFields.filter(k => amalan[k]).length;
  const amalanPercent = Math.round((completedAmalan / 5) * 100);

  const selectedSurahData = quranSurahs.find(s => s.name === editSurah);
  const maxAyat = selectedSurahData ? selectedSurahData.ayat : 1;

  useEffect(() => {
    if (editAyat > maxAyat) setEditAyat(maxAyat);
  }, [editSurah, maxAyat, editAyat]);

  // FIX: Kalender menggunakan Waktu Lokal yang Akurat
  const generateLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d); 
      
      const existingData = history.find(h => h.log_date === dateStr);
      if (existingData) {
        days.push(existingData);
      } else if (i === 0) {
        days.push({
          log_date: dateStr,
          subuh: ibadah.subuh, dzuhur: ibadah.dzuhur, ashar: ibadah.ashar, maghrib: ibadah.maghrib, isya: ibadah.isya,
          dzikir_pagi: amalan.dzikir_pagi, dzikir_petang: amalan.dzikir_petang, istighfar: amalan.istighfar, sholawat: amalan.sholawat, sedekah: amalan.sedekah
        });
      } else {
        days.push({ log_date: dateStr });
      }
    }
    return days;
  };

  const trackerDays = generateLast7Days();

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-8xl mx-auto font-sans bg-[#F8FAFC] pb-20 selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* MODAL QURAN UPDATE */}
      {isQuranModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Update Tilawah</h3>
              <button onClick={() => setIsQuranModalOpen(false)} className="text-slate-400 hover:text-red-500"><FaTimes size={20}/></button>
            </div>
            
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pilih Surah</label>
            <select value={editSurah} onChange={e => setEditSurah(e.target.value)} className="w-full p-4 mb-4 border border-slate-200 rounded-xl bg-slate-50 font-bold text-emerald-800 outline-none focus:border-emerald-500 cursor-pointer">
              {quranSurahs.map(s => <option key={s.no} value={s.name}>{s.no}. {s.name} ({s.ayat} Ayat)</option>)}
            </select>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Ayat</label>
                <input type="number" min="1" max={maxAyat} value={editAyat} onChange={e => { let val = parseInt(e.target.value); if(val > maxAyat) val = maxAyat; setEditAyat(val); }} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center font-bold outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hal</label>
                <input type="number" min="1" max="604" value={editPage} onChange={e => setEditPage(parseInt(e.target.value))} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center font-bold outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Juz</label>
                <input type="number" min="1" max="30" value={editJuz} onChange={e => setEditJuz(parseInt(e.target.value))} className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center font-bold outline-none focus:border-emerald-500" />
              </div>
            </div>

            <button onClick={handleSaveQuran} className="w-full py-4 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30">Simpan Bacaan</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FaMosque className="text-emerald-600" /> Spiritual Dashboard
          </h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Pantau ibadah, amalan, dan perkembangan spiritual harian.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hari Ini</p>
            <p className="text-sm font-black text-slate-800">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Summary Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { title: "Sholat Wajib", val: `${completedSholat} / 5`, icon: <FaPrayingHands />, color: "emerald" },
          { title: "Puasa Sunnah", val: ibadah.puasa_senin || ibadah.puasa_kamis ? "✔ Aktif" : "Tidak", icon: <FaMoon />, color: "indigo" },
          { title: "Progress Quran", val: `Juz ${quran.juz || 0} Hal ${quran.page || 0}`, icon: <FaBookOpen />, color: "amber" },
          { title: "Amalan Harian", val: `${amalanPercent}%`, icon: <FaChartPie />, color: "blue" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center text-2xl shrink-0`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</p>
              <h4 className="text-xl font-black text-slate-800">{item.val}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* ================= KOLOM KIRI ================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Jadwal Sholat Widget (Ditambah Tanggal Realtime) */}
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-lg shadow-slate-900/20 text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl text-emerald-400 border border-white/10 shrink-0"><FaClock /></div>
               <div>
                 <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1"><FaMapMarkerAlt /> Jadwal Adzan • <span className="text-slate-300 font-medium">{currentDate}</span></p>
                 <select value={selectedCity} onChange={handleCityChange} className="bg-transparent text-lg font-black text-white outline-none cursor-pointer hover:text-emerald-300 transition-colors">
                    {Object.keys(CITIES).map(city => <option key={city} value={city} className="text-slate-900">{city}</option>)}
                 </select>
               </div>
             </div>

             <div className="flex gap-4 relative z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {prayerTimes ? (
                  ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map(sholat => (
                    <div key={sholat} className="bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[80px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{sholat}</p>
                      <p className="text-sm font-black text-emerald-300">{prayerTimes[sholat]}</p>
                    </div>
                  ))
                ) : <p className="text-sm text-slate-400 animate-pulse">Memuat jadwal sholat...</p>}
             </div>
          </div>

          {/* Ibadah Harian */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><FaPrayingHands className="text-emerald-500" /> Ibadah Harian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Sholat Wajib</h4>
                <div className="space-y-3">
                  {sholatWajib.map(sholat => (
                    <div key={sholat} onClick={() => handleToggleIbadah(sholat)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${ibadah[sholat] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-emerald-200'}`}>
                      <span className={`font-bold text-sm capitalize ${ibadah[sholat] ? 'text-emerald-800' : 'text-slate-600'}`}>{sholat}</span>
                      <div className={`text-xl transition-colors ${ibadah[sholat] ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {ibadah[sholat] ? <FaCheckCircle /> : <FaRegCircle />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Sholat Sunnah Utama</h4>
                <div className="space-y-3">
                  {['dhuha', 'tahajud'].map(sholat => (
                    <div key={sholat} onClick={() => handleToggleIbadah(sholat)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${ibadah[sholat] ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'}`}>
                      <span className={`font-bold text-sm capitalize ${ibadah[sholat] ? 'text-indigo-800' : 'text-slate-600'}`}>{sholat}</span>
                      <div className={`text-xl transition-colors ${ibadah[sholat] ? 'text-indigo-500' : 'text-slate-300'}`}>
                        {ibadah[sholat] ? <FaCheckCircle /> : <FaRegCircle />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quran Last Read (Dibuat Lebih Tinggi) */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-8 md:p-10 min-h-[380px] rounded-[2.5rem] shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border border-white/20 shrink-0"><FaBookOpen className="text-emerald-300" /></div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Terakhir Dibaca</p>
                  <h3 className="text-3xl font-black tracking-tight">{quran.surah} <span className="text-emerald-400 text-xl font-bold">Ayat {quran.ayat}</span></h3>
                  <p className="text-sm text-emerald-100 font-medium mt-1">Juz {quran.juz} | Halaman {quran.page}</p>
                </div>
              </div>
              <button onClick={() => { setEditSurah(quran.surah || 'Al-Fatihah'); setEditAyat(quran.ayat || 1); setEditPage(quran.page || 1); setEditJuz(quran.juz || 1); setIsQuranModalOpen(true); }} className="px-8 py-4 bg-white text-emerald-800 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-lg w-full md:w-auto">Update Bacaan</button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <div className="flex justify-between text-xs font-bold text-emerald-100 mb-2"><span>Progress Juz {quran.juz}</span><span>{Math.round((quran.page % 20) / 20 * 100) || 0}%</span></div>
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden"><div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(quran.page % 20) / 20 * 100}%` }}></div></div>
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN (Sidebar Widget) ================= */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2"><FaMoon className="text-indigo-500" /> Puasa Sunnah</h3>
            <div className="flex gap-3 mb-5">
              {['puasa_senin', 'puasa_kamis'].map(hari => (
                <div key={hari} onClick={() => handleToggleIbadah(hari)} className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all ${ibadah[hari] ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{hari.replace('puasa_', '')}</span>
                  <div className="mt-1 text-lg">{ibadah[hari] ? <FaCheckCircle className="mx-auto" /> : <FaRegCircle className="mx-auto" />}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2"><FaLeaf className="text-emerald-500" /> Amalan Harian</h3>
            <div className="space-y-2.5">
              {dbAmalanFields.map(amal => (
                <div key={amal} onClick={() => handleToggleAmalan(amal)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${amalan[amal] ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                  <span className={`text-sm font-bold capitalize ${amalan[amal] ? 'text-emerald-800' : 'text-slate-600'}`}>{amal.replace('_', ' ')}</span>
                  <div className={`text-lg transition-colors ${amalan[amal] ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {amalan[amal] ? <FaCheckCircle /> : <FaRegCircle />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
            <h3 className="text-base font-black text-slate-800 mb-5 flex items-center gap-2"><FaHeart className="text-rose-500" /> Refleksi Harian</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Syukur Hari Ini</label>
                <textarea value={reflection.gratitude || ''} onChange={e => handleReflectionChange('gratitude', e.target.value)} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none" placeholder="Alhamdulillah untuk..."></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Muhasabah (Kesalahan)</label>
                <textarea value={reflection.mistake || ''} onChange={e => handleReflectionChange('mistake', e.target.value)} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 resize-none" placeholder="Astaghfirullah..."></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mood / Perasaan</label>
                <div className="flex flex-wrap gap-2">
                  {[ { emoji: '😌', val: 'tenang' }, { emoji: '😔', val: 'sedih' }, { emoji: '😟', val: 'cemas' }, { emoji: '🙏', val: 'bersyukur' }, { emoji: '🔥', val: 'semangat' } ].map(m => (
                    <button key={m.val} onClick={() => handleReflectionChange('mood', m.val)} className={`p-2 rounded-xl text-lg flex items-center justify-center transition-all border ${reflection.mood === m.val ? 'bg-rose-50 border-rose-300 shadow-sm scale-110' : 'bg-white border-slate-200 hover:bg-slate-50'}`} title={m.val}>{m.emoji}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION DOA PRIBADI (DIPINDAH KE BAWAH FULL WIDTH) ================= */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><FaPrayingHands className="text-blue-500" /> Kumpulan Doa Pribadi</h3>
          <button onClick={handleAddDoa} className="text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 flex items-center gap-2 transition-colors">
            <FaPlus /> Tambah Doa
          </button>
        </div>
        {/* Diubah menjadi lebar 2 kolom (md:grid-cols-2) agar teks doa tidak terjepit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doaList.length === 0 ? <p className="text-sm text-slate-400 py-6 col-span-full text-center">Belum ada doa tersimpan.</p> : doaList.map(doa => (
            <div key={doa.id} className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl group relative hover:border-blue-300 transition-all flex flex-col justify-between hover:shadow-md">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDeleteDoa(doa.id)} className="p-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl shadow-sm border border-slate-100 transition-colors"><FaTrash size={14}/></button>
              </div>
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg mb-4 inline-block">{doa.category}</span>
                <h4 className="text-lg font-black text-slate-900 mb-2 pr-12">{doa.title}</h4>
              </div>
              <p className="text-sm md:text-base text-slate-600 italic leading-relaxed font-medium bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-2">
                "{doa.content}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION RIWAYAT SPIRITUAL ================= */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <FaCalendarCheck className="text-blue-500" /> Riwayat Spiritual (7 Hari Terakhir)
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mb-6">*Klik pada kartu hari untuk mengedit riwayat ibadah yang terlewat.</p>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {trackerDays.map((day, idx) => {
            const sholatScore = ['subuh','dzuhur','ashar','maghrib','isya'].filter(k => day[k]).length;
            const amalanScore = ['dzikir_pagi','dzikir_petang','istighfar','sholawat','sedekah'].filter(k => day[k]).length;
            const isToday = idx === trackerDays.length - 1;

            const dateObj = new Date(day.log_date);
            const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
            const dateNum = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

            const handleEditHistory = async () => {
              if (isToday) return Swal.fire({ icon: 'info', title: 'Ini Hari Ini', text: 'Silakan gunakan widget "Ibadah Harian" di atas untuk hari ini.', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });

              const { value: formValues } = await Swal.fire({
                title: `Edit Riwayat`,
                html: `
                  <div class="text-left font-sans">
                    <p class="text-sm font-bold text-slate-500 mb-6 text-center">${dayName}, ${dateNum}</p>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                      <h4 class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fa fa-praying-hands"></i> Sholat Wajib</h4>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"><input type="checkbox" id="h-subuh" class="w-4 h-4 accent-emerald-500" ${day.subuh ? 'checked' : ''}> Subuh</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"><input type="checkbox" id="h-dzuhur" class="w-4 h-4 accent-emerald-500" ${day.dzuhur ? 'checked' : ''}> Dzuhur</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"><input type="checkbox" id="h-ashar" class="w-4 h-4 accent-emerald-500" ${day.ashar ? 'checked' : ''}> Ashar</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"><input type="checkbox" id="h-maghrib" class="w-4 h-4 accent-emerald-500" ${day.maghrib ? 'checked' : ''}> Maghrib</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"><input type="checkbox" id="h-isya" class="w-4 h-4 accent-emerald-500" ${day.isya ? 'checked' : ''}> Isya</label>
                      </div>
                    </div>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fa fa-leaf"></i> Amalan Harian</h4>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"><input type="checkbox" id="h-dzikir_pagi" class="w-4 h-4 accent-blue-500" ${day.dzikir_pagi ? 'checked' : ''}> Dzikir Pagi</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"><input type="checkbox" id="h-dzikir_petang" class="w-4 h-4 accent-blue-500" ${day.dzikir_petang ? 'checked' : ''}> Dzikir Pet</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"><input type="checkbox" id="h-istighfar" class="w-4 h-4 accent-blue-500" ${day.istighfar ? 'checked' : ''}> Istighfar</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"><input type="checkbox" id="h-sholawat" class="w-4 h-4 accent-blue-500" ${day.sholawat ? 'checked' : ''}> Sholawat</label>
                        <label class="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"><input type="checkbox" id="h-sedekah" class="w-4 h-4 accent-blue-500" ${day.sedekah ? 'checked' : ''}> Sedekah</label>
                      </div>
                    </div>
                  </div>
                `,
                showCancelButton: true, confirmButtonText: 'Simpan', cancelButtonText: 'Batal', confirmButtonColor: '#10B981', customClass: { popup: 'rounded-[2rem] p-6 max-w-lg' },
                preConfirm: () => ({
                  log_date: day.log_date,
                  ibadah: { subuh: (document.getElementById('h-subuh') as HTMLInputElement).checked, dzuhur: (document.getElementById('h-dzuhur') as HTMLInputElement).checked, ashar: (document.getElementById('h-ashar') as HTMLInputElement).checked, maghrib: (document.getElementById('h-maghrib') as HTMLInputElement).checked, isya: (document.getElementById('h-isya') as HTMLInputElement).checked },
                  amalan: { dzikir_pagi: (document.getElementById('h-dzikir_pagi') as HTMLInputElement).checked, dzikir_petang: (document.getElementById('h-dzikir_petang') as HTMLInputElement).checked, istighfar: (document.getElementById('h-istighfar') as HTMLInputElement).checked, sholawat: (document.getElementById('h-sholawat') as HTMLInputElement).checked, sedekah: (document.getElementById('h-sedekah') as HTMLInputElement).checked }
                })
              });

              if (formValues) {
                try {
                  const res = await fetch(`${API_URL}/api/spiritual/history`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(formValues) });
                  if (res.ok) { Swal.fire({ icon: 'success', title: 'Riwayat Diperbarui', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false }); fetchSpiritualData(); }
                } catch (err) { Swal.fire('Error', 'Gagal menyimpan data', 'error'); }
              }
            };

            return (
              <div key={day.log_date} onClick={handleEditHistory} className={`min-w-[140px] p-4 rounded-[1.5rem] border transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg ${isToday ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100 hover:border-blue-300'}`}>
                <div className="text-center mb-3">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{isToday ? 'Hari Ini' : dayName}</p>
                  <p className="text-sm font-bold text-slate-700">{dateNum}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1"><span>Sholat</span><span className={sholatScore === 5 ? 'text-emerald-500' : ''}>{sholatScore}/5</span></div>
                    <div className="flex gap-0.5 h-1.5">{[...Array(5)].map((_, i) => <div key={i} className={`flex-1 rounded-full ${i < sholatScore ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>)}</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1"><span>Amalan</span><span className={amalanScore === 5 ? 'text-emerald-500' : ''}>{amalanScore}/5</span></div>
                    <div className="flex gap-0.5 h-1.5">{[...Array(5)].map((_, i) => <div key={i} className={`flex-1 rounded-full ${i < amalanScore ? 'bg-blue-400' : 'bg-slate-200'}`}></div>)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Spiritual;