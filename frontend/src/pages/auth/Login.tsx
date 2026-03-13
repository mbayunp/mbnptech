// src/pages/auth/Login.tsx
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Simpan token & data user ke Local Storage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        Swal.fire({
          icon: 'success', title: 'Berhasil Login!', toast: true, position: 'top-end',
          showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-2xl' }
        });

        // Arahkan ke Dashboard
        navigate('/admin/dashboard');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error', title: 'Login Gagal', text: error.message,
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
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back! 👋</h1>
          <p className="text-slate-500 text-sm">Login ke sistem MBNP Tech Dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@mbnptech.com" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" />
          </div>
          <button type="submit" disabled={isLoading} className={`w-full py-4 text-white font-bold rounded-xl transition-all ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'}`}>
            {isLoading ? 'Memeriksa...' : 'Login ke Dashboard'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;