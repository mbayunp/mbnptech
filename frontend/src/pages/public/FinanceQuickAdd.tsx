// src/pages/public/FinanceQuickAdd.tsx
import { useState, FormEvent, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaLock, FaUnlock, FaWallet, FaArrowRight, FaCreditCard, FaCalendarAlt, FaTag, FaPen } from 'react-icons/fa';
import { API_URL } from '../../config/api';

// DATA KATEGORI & SUMBER UANG
const INCOME_CATEGORIES = ["Gaji", "Projek", "Pinjaman", "Lainnya"];
const EXPENSE_CATEGORIES = ["Kosan", "Motor", "Melunasi Hutang", "Makan & Minum", "Sedekah", "Memberi", "Jajan", "Barang", "Laundry", "Lainnya"];
const SOURCES = ["Bank BJB", "Digicash", "Bank BSI 1", "Bank BSI 2", "Dana", "Cash/Dompet", "Gopay", "Shopeepay"];

const FinanceQuickAdd = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // --- FUNGSI WAKTU LOKAL (WIB/WITA/WIT) ---
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // States Form
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [source, setSource] = useState(SOURCES[5]); 
  const [description, setDescription] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState(0);
  
  // State Tanggal menggunakan waktu lokal
  const [qaDate, setQaDate] = useState(getLocalDate());

  const SECRET_PIN = '091001';

  const handlePinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin === SECRET_PIN) {
      setIsUnlocked(true);
      Swal.fire({ icon: 'success', title: 'Akses Diberikan', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } else {
      Swal.fire({ icon: 'error', title: 'PIN Salah!', text: 'Akses ditolak.', confirmButtonColor: '#EF4444' });
      setPin('');
    }
  };

  useEffect(() => {
    if (transactionType === 'income') setCategory(INCOME_CATEGORIES[0]);
    else setCategory(EXPENSE_CATEGORIES[0]);
  }, [transactionType]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDescription(val);
    
    if (transactionType === 'expense') {
      const lower = val.toLowerCase();
      if(lower.includes('makan') || lower.includes('kopi') || lower.includes('roti') || lower.includes('air')) setCategory('Makan & Minum');
      else if(lower.includes('kosan') || lower.includes('sewa') || lower.includes('kontrakan')) setCategory('Kosan');
      else if(lower.includes('motor') || lower.includes('bensin') || lower.includes('parkir') || lower.includes('bengkel')) setCategory('Motor');
      else if(lower.includes('laundry') || lower.includes('cucian')) setCategory('Laundry');
      else if(lower.includes('shopee') || lower.includes('tokopedia') || lower.includes('beli')) setCategory('Barang');
      else if(lower.includes('jajan') || lower.includes('cilok') || lower.includes('seblak') || lower.includes('ngemil')) setCategory('Jajan');
      else if(lower.includes('sedekah') || lower.includes('infaq') || lower.includes('zakat') || lower.includes('masjid')) setCategory('Sedekah');
      else if(lower.includes('kasih') || lower.includes('ibu') || lower.includes('bapak') || lower.includes('adik') || lower.includes('keluarga')) setCategory('Memberi');
      else if(lower.includes('bayar hutang') || lower.includes('cicilan') || lower.includes('pinjaman')) setCategory('Melunasi Hutang');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numberValue = parseInt(rawValue, 10);
    setRawAmount(isNaN(numberValue) ? 0 : numberValue);
    setDisplayAmount(rawValue === '' ? '' : new Intl.NumberFormat('id-ID').format(numberValue));
  };

  const handleFinanceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rawAmount <= 0) {
      Swal.fire({ icon: 'warning', title: 'Nominal Kosong', text: 'Masukkan nominal lebih dari 0.' });
      return;
    }

    setIsLoading(true);

    const formData = {
      date: qaDate, // Menggunakan state qaDate yang sudah lokal
      type: transactionType,
      category: category,
      source: source,
      amount: rawAmount,
      description: description || '', 
    };

    try {
      const response = await fetch(`${API_URL}/api/finances/quick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Tersimpan!',
          text: `Rp ${rawAmount.toLocaleString('id-ID')} berhasil dicatat ke ${source}.`,
          confirmButtonColor: '#2563EB',
          customClass: { popup: 'rounded-3xl' }
        });

        // Reset form
        setTransactionType('expense');
        setCategory(EXPENSE_CATEGORIES[0]);
        setSource(SOURCES[5]);
        setDisplayAmount('');
        setRawAmount(0);
        setDescription('');
        setQaDate(getLocalDate()); // Reset ke hari ini
      } else {
        throw new Error(result.message || 'Gagal menyimpan ke database.');
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Oops!', text: error.message || 'Koneksi ke server terputus.', confirmButtonColor: '#EF4444' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 selection:bg-blue-200">
        <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-center border border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-3xl mx-auto mb-6"><FaLock /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Akses Terkunci</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">Masukkan PIN untuk mencatat keuangan.</p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)}
              placeholder="••••" autoFocus
              className="w-full text-center tracking-[1em] font-black text-3xl min-h-[64px] px-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none mb-6 transition-colors"
            />
            <button type="submit" className="w-full min-h-[60px] py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-lg">
              <FaUnlock /> Buka Brankas
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 flex items-center justify-center font-sans selection:bg-blue-200">
      <div className="w-full max-w-xl bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
              <FaWallet />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">Quick Note</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Finance Tracker</p>
            </div>
          </div>
          <button onClick={() => setIsUnlocked(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors" title="Kunci Kembali">
            <FaLock size={14}/>
          </button>
        </div>

        <form onSubmit={handleFinanceSubmit} className="space-y-6">

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex-1 min-h-[52px] text-sm md:text-base font-black rounded-xl transition-all ${transactionType === 'expense' ? 'bg-white text-rose-600 shadow-md border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📉 Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex-1 min-h-[52px] text-sm md:text-base font-black rounded-xl transition-all ${transactionType === 'income' ? 'bg-white text-emerald-600 shadow-md border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              📈 Pemasukan
            </button>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nominal Uang (Rp)</label>
            <div className="relative">
              <span className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl md:text-3xl ${transactionType === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>Rp</span>
              <input
                type="text" inputMode="numeric" required
                value={displayAmount} onChange={handleAmountChange} placeholder="0"
                className={`w-full pl-16 md:pl-20 pr-6 min-h-[72px] md:min-h-[80px] rounded-[1.5rem] border-2 bg-slate-50 outline-none transition-all text-3xl md:text-4xl font-black ${transactionType === 'expense' ? 'border-rose-100 focus:bg-white focus:border-rose-500 text-rose-600' : 'border-emerald-100 focus:bg-white focus:border-emerald-500 text-emerald-600'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FaCreditCard/> Sumber Dana</label>
              <div className="relative">
                <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full px-5 min-h-[56px] rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none bg-slate-50 text-base font-bold text-slate-700 appearance-none cursor-pointer transition-all">
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FaTag/> Kategori</label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 min-h-[56px] rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none bg-slate-50 text-base font-bold text-slate-700 appearance-none cursor-pointer transition-all">
                  {transactionType === 'income' 
                    ? INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                    : EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FaCalendarAlt/> Tanggal</label>
              <input
                type="date" required 
                value={qaDate} 
                onChange={(e) => setQaDate(e.target.value)}
                className="w-full px-5 min-h-[56px] rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none bg-slate-50 transition-all font-bold text-slate-700 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FaPen/> Catatan (Opsional)</label>
              <input
                type="text" value={description} onChange={handleDescriptionChange}
                placeholder='Ketik "makan", "bensin"...'
                className="w-full px-5 min-h-[56px] rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none bg-slate-50 transition-all font-bold text-slate-700 text-base"
              />
            </div>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 text-center !mt-3">*Kategori akan otomatis mendeteksi kata yang Anda ketik di catatan.</p>

          <button
            type="submit" disabled={isLoading}
            className={`w-full min-h-[64px] text-white font-black rounded-2xl transition-all text-lg flex items-center justify-center gap-3 mt-8 shadow-xl hover:-translate-y-1
              ${isLoading ? 'bg-slate-400' : transactionType === 'expense' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
          >
            {isLoading ? 'Menyimpan Data...' : 'Simpan Transaksi Sekarang'} <FaArrowRight className="text-base opacity-80" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default FinanceQuickAdd;