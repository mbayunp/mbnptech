'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const registerMutation = useMutation({
    mutationFn: async () => {
      setErrorMsg('');
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { token, user } = data.data;
      loginStore(token, user);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Registrasi gagal. Pastikan email belum terdaftar.';
      setErrorMsg(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#01070e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-sapphire-600/10 rounded-full filter blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gold-700/5 rounded-full filter blur-[100px] -z-10" />

      <div className="w-full max-w-md glass-premium p-8 sm:p-10 rounded-[2.5rem] border border-gold-500/15 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold tracking-[0.2em] text-white justify-center group mb-4">
            <div className="relative w-8 h-8 flex items-center justify-center bg-sapphire-950 border border-gold-500/20 rounded-full overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img src="/logo1.png" alt="MBNP Logo" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(8,80,144,0.6)]" />
            </div>
            <span>MBNP <span className="text-gold-500 font-semibold">INVITE</span></span>
          </Link>
          <h2 className="text-lg font-cinzel font-bold text-white">Buat Akun Gratis</h2>
          <p className="text-xs text-slate-400 mt-1">Mulai rancang undangan digital premium Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs flex gap-2.5 items-center">
            <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 text-sm transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 text-sm transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 text-sm transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 font-black text-xs tracking-widest uppercase transition-premium flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-500/10 border border-gold-300/20"
          >
            {registerMutation.isPending ? (
              <span>Sedang Mendaftar...</span>
            ) : (
              <>
                <span>Daftar Sekarang</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
          <span>Sudah punya akun? </span>
          <Link href="/login" className="font-bold text-gold-500 hover:text-gold-400 transition-colors">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
