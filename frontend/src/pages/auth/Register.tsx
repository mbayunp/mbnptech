// src/pages/auth/Register.tsx
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: 'success', title: 'Berhasil!', text: 'Akun berhasil dibuat. Silakan login.',
          confirmButtonColor: '#2563EB', customClass: { popup: 'rounded-3xl' }
        });
        navigate('/login');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error', title: 'Registrasi Gagal', text: error.message,
        confirmButtonColor: '#EF4444', customClass: { popup: 'rounded-3xl' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Buat Akun 🚀</h1>
          <p className="text-slate-500 text-sm">Daftar untuk mengakses sistem MBNP Tech.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Bayu Nurdiansyah" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@mbnptech.com" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" minLength={6} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full py-4 text-white font-bold rounded-xl transition-all ${isLoading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-lg'}`}>
            {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;