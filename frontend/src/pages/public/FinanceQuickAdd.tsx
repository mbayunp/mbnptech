// src/pages/public/FinanceQuickAdd.tsx
import { useState, FormEvent } from 'react';
import Swal from 'sweetalert2';
import { FaLock, FaUnlock, FaWallet, FaArrowRight } from 'react-icons/fa';
import { API_URL } from '../../config/api';

const FinanceQuickAdd = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

  // State khusus untuk format mata uang
  const [displayAmount, setDisplayAmount] = useState('');
  const [rawAmount, setRawAmount] = useState(0);

  const SECRET_PIN = '091001';

  // --- LOGIKA KEAMANAN PIN ---
  const handlePinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin === SECRET_PIN) {
      setIsUnlocked(true);
      Swal.fire({
        icon: 'success',
        title: 'Akses Diberikan',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'PIN Salah!',
        text: 'Akses ditolak.',
        confirmButtonColor: '#EF4444',
      });
      setPin('');
    }
  };

  // --- LOGIKA FORMAT MATA UANG (REAL-TIME) ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numberValue = parseInt(rawValue, 10);

    setRawAmount(isNaN(numberValue) ? 0 : numberValue);

    if (rawValue === '') {
      setDisplayAmount('');
    } else {
      // Format tampilan dengan titik (ID-ID)
      const formatted = new Intl.NumberFormat('id-ID').format(numberValue);
      setDisplayAmount(formatted);
    }
  };

  // --- LOGIKA FORM QUICK ADD ---
  const handleFinanceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rawAmount <= 0) {
      Swal.fire({ icon: 'warning', title: 'Nominal Kosong', text: 'Masukkan nominal lebih dari 0.' });
      return;
    }

    setIsLoading(true);

    const form = e.currentTarget;
    // Mengambil nilai input secara manual untuk akurasi
    const categoryInput = form.elements.namedItem('category') as HTMLInputElement;
    const descriptionInput = form.elements.namedItem('description') as HTMLInputElement;

    const formData = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      type: transactionType,
      category: categoryInput.value,
      amount: rawAmount, // Mengirim angka murni (200000)
      description: descriptionInput.value || '', // Pastikan namanya 'description' sesuai backend
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
          text: `Rp ${rawAmount.toLocaleString('id-ID')} berhasil dicatat.`,
          confirmButtonColor: '#2563EB',
          customClass: { popup: 'rounded-3xl' }
        });

        // Reset form dan state
        form.reset();
        setTransactionType('expense');
        setDisplayAmount('');
        setRawAmount(0);
      } else {
        // Jika server merespon 500 atau success: false
        throw new Error(result.message || 'Gagal menyimpan ke database.');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.message || 'Koneksi ke server terputus.',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAMPILAN LOCK SCREEN ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl mx-auto mb-6">
            <FaLock />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Private Area</h2>
          <p className="text-slate-500 text-sm mb-8">Masukkan PIN akses untuk mencatat keuangan.</p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[1em] font-black text-2xl px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none mb-6"
            />
            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <FaUnlock /> Buka Kunci
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- TAMPILAN QUICK ADD ---
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg">
              <FaWallet />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight">Quick Note</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Finance Tracker</p>
            </div>
          </div>
          <button onClick={() => setIsUnlocked(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
            <FaLock />
          </button>
        </div>

        <form onSubmit={handleFinanceSubmit} className="space-y-6">

          {/* Tipe Transaksi */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${transactionType === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${transactionType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              Pemasukan
            </button>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nominal (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={handleAmountChange}
                required
                placeholder="0"
                className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-2xl font-black text-slate-900"
              />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
            <input
              type="text"
              name="category"
              required
              placeholder="Misal: Makan, Bensin, Gaji"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-slate-50 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catatan (Opsional)</label>
            <input
              type="text"
              name="description"
              placeholder="Keterangan tambahan..."
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-slate-50 transition-all text-sm text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 text-white font-black rounded-xl transition-all text-lg flex items-center justify-center gap-2 mt-4
              ${isLoading ? 'bg-slate-400' : transactionType === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Cepat'} <FaArrowRight className="text-sm opacity-70" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default FinanceQuickAdd;