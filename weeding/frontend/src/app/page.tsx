'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Layout,
  Music,
  Calendar,
  Share2,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle2,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const features = [
    {
      icon: <Layout className="text-gold-500" size={24} />,
      title: "Desain Premium & Responsive",
      description: "Pilih berbagai template eksklusif (Romantic, Islami, Royal Luxury, Minimal) yang dirancang untuk tampil sempurna di perangkat HP, tablet, maupun laptop."
    },
    {
      icon: <Music className="text-gold-500" size={24} />,
      title: "Musik Latar & Galeri Interaktif",
      description: "Tambahkan alunan lagu romantis favorit Anda dan sajikan galeri foto momen terindah bersama pasangan dengan transisi super halus."
    },
    {
      icon: <Share2 className="text-gold-500" size={24} />,
      title: "Subdomain Kustom Cantik",
      description: "Dapatkan alamat subdomain kustom khusus untuk hari bahagia Anda secara instan seperti: andi-salsa.mbnp.my.id."
    },
    {
      icon: <Calendar className="text-gold-500" size={24} />,
      title: "Sistem RSVP & Manajemen Tamu",
      description: "Pantau konfirmasi kehadiran para tamu secara langsung (real-time) melalui dashboard admin canggih Anda."
    }
  ];

  const templates = [
    {
      name: "Romantic Sweet",
      desc: "Desain penuh kehangatan dengan sentuhan pastel, ornamen bunga manis, dan transisi lembut.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
      demoUrl: "http://andi-salsa.localhost:3000?theme=romantic",
      badge: "Terpopuler"
    },
    {
      name: "Islami Elegant",
      desc: "Sentuhan ornamen arabesque hijau-emas bernuansa agung, khidmat, dan penuh doa restu.",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600",
      demoUrl: "http://andi-salsa.localhost:3000?theme=islami",
      badge: "Sarat Makna"
    },
    {
      name: "Royal Luxury",
      desc: "Estetika hitam-emas berkelas tinggi dengan kontras mewah untuk merayakan pernikahan megah.",
      image: "https://images.unsplash.com/photo-1507504038482-7621ee28c249?auto=format&fit=crop&q=80&w=600",
      demoUrl: "http://andi-salsa.localhost:3000?theme=luxury",
      badge: "Premium Class"
    },
    {
      name: "Minimal Modern",
      desc: "Estetika monokrom bersih, ruang longgar, berjarak lega, dan sangat disukai pasangan perkotaan.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
      demoUrl: "http://andi-salsa.localhost:3000?theme=minimal",
      badge: "Modern 2026"
    }
  ];

  const testimonials = [
    {
      name: "Rian & Mutiara",
      role: "Menikah Mei 2026",
      quote: "Desain undangan digital MBNP Invite luar biasa mewah. Teman-teman kami memuji tampilan dan lagunya yang langsung otomatis berputar lancar di HP mereka.",
      rating: 5
    },
    {
      name: "Aditya & Sarah",
      role: "Menikah April 2026",
      quote: "Dashboard management RSVP-nya sangat membantu! Kami bisa tahu siapa saja yang hadir dan jumlah rombongannya secara akurat. Worth every single penny!",
      rating: 5
    }
  ];

  const nextTemplate = () => {
    setActiveTemplateIdx((prev) => (prev + 1) % templates.length);
  };

  const prevTemplate = () => {
    setActiveTemplateIdx((prev) => (prev - 1 + templates.length) % templates.length);
  };

  return (
    <div className="min-h-screen bg-[#01070e] text-slate-100 font-sans selection:bg-gold-500/20 selection:text-gold-100 relative overflow-x-hidden">
      
      {/* Decorative Glowing Radial Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sapphire-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] bg-gold-700/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[40vw] h-[40vw] bg-sapphire-700/10 rounded-full filter blur-[130px] pointer-events-none" />

      {/* Header / Floating Navbar */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="glass-premium rounded-full px-6 py-3.5 flex items-center justify-between transition-premium border border-gold-500/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-sapphire-950 border border-gold-500/20 rounded-full overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img src="/logo1.png" alt="MBNP Logo" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(8,80,144,0.6)]" />
            </div>
            <span className="font-cinzel text-base font-bold tracking-[0.2em] text-white flex items-center gap-1.5">
              MBNP <span className="text-gold-500 font-semibold">INVITE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-xs font-semibold tracking-wider text-slate-300 hover:text-gold-500 transition-colors uppercase">Fitur</a>
            <a href="#tema" className="text-xs font-semibold tracking-wider text-slate-300 hover:text-gold-500 transition-colors uppercase">Pilihan Tema</a>
            <a href="#testimoni" className="text-xs font-semibold tracking-wider text-slate-300 hover:text-gold-500 transition-colors uppercase">Testimoni</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sapphire-600 to-sapphire-700 hover:from-sapphire-500 hover:to-sapphire-600 text-white font-bold text-xs tracking-wider uppercase transition-premium flex items-center gap-2 shadow-lg shadow-sapphire-950/50 border border-sapphire-500/20"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold tracking-wider text-slate-300 hover:text-white uppercase transition-colors">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 font-black text-xs tracking-wider uppercase transition-premium shadow-lg shadow-gold-500/10 border border-gold-300/20"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-[#01070e]/95 backdrop-blur-lg px-6 py-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-12">
                <span className="font-cinzel text-lg font-bold tracking-[0.2em] text-white">
                  MBNP <span className="text-gold-500">INVITE</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-center">
                <a
                  href="#fitur"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold tracking-widest text-slate-200 hover:text-gold-500 uppercase py-2"
                >
                  Fitur
                </a>
                <a
                  href="#tema"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold tracking-widest text-slate-200 hover:text-gold-500 uppercase py-2"
                >
                  Pilihan Tema
                </a>
                <a
                  href="#testimoni"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold tracking-widest text-slate-200 hover:text-gold-500 uppercase py-2"
                >
                  Testimoni
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-full bg-sapphire-600 text-white font-bold text-sm tracking-widest uppercase transition-premium"
                >
                  Dashboard Admin
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 rounded-full border border-slate-700 text-slate-200 font-bold text-sm tracking-widest uppercase"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 rounded-full bg-gold-500 text-sapphire-950 font-black text-sm tracking-widest uppercase"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 px-6 text-center max-w-7xl mx-auto">
        
        {/* Floating Ring Ornaments */}
        <div className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full border border-gold-500/10 animate-float opacity-30 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-[20%] right-[8%] w-32 h-32 rounded-full border border-gold-500/10 animate-float opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sapphire-950/80 border border-gold-500/20 text-gold-400 font-bold text-[10px] tracking-wider uppercase mb-8 shadow-inner">
              <Sparkles size={12} className="fill-gold-400 text-gold-400" />
              <span>Cinematic Digital Wedding Invitation SaaS</span>
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-cinzel font-bold tracking-wide text-white leading-[1.15] mb-8">
              Sajikan Kebahagiaan <br />
              <span className="text-gold-gradient">
                Sangat Mewah & Elegan
              </span>
            </h1>

            <p className="text-slate-400 font-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10">
              Rancang undangan pernikahan digital premium Anda dalam hitungan menit. Dilengkapi latar musik romantis, galeri interaktif, rute peta, manajemen RSVP terpadu, dan subdomain dinamis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 font-black text-xs tracking-widest uppercase transition-premium shadow-lg shadow-gold-500/10 flex items-center justify-center gap-2"
              >
                <span>Mulai Buat Undangan</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="http://andi-salsa.localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#020b18]/80 border border-slate-800 text-slate-200 hover:bg-[#03142a]/80 font-bold text-xs tracking-widest uppercase transition-premium flex items-center justify-center gap-2"
              >
                <span>Lihat Demo Undangan</span>
              </a>
            </div>
          </motion.div>

          {/* Invitation Mockup Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 w-full max-w-3xl relative"
          >
            {/* Phone Mockup Frame */}
            <div className="relative mx-auto w-[280px] h-[570px] bg-slate-900 border-[10px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden shadow-gold-500/5 ring-1 ring-gold-500/20">
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex justify-center items-center z-20">
                <div className="w-12 h-3.5 bg-slate-900 rounded-b-md" />
              </div>
              <iframe
                src="http://andi-salsa.localhost:3000?preview=true"
                className="w-full h-full border-none pt-4 bg-[#020617]"
                title="Mockup Preview"
              />
            </div>
            
            {/* Side Decorative Cards */}
            <div className="absolute top-1/4 -left-12 hidden lg:block glass-premium p-5 rounded-2xl border border-gold-500/10 text-left w-52 shadow-lg animate-float">
              <div className="flex items-center gap-2.5 mb-2">
                <Crown size={16} className="text-gold-500" />
                <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase">Premium Layout</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tiap detil diatur presisi untuk menyajikan kemewahan visual yang dinamis.
              </p>
            </div>

            <div className="absolute bottom-1/4 -right-12 hidden lg:block glass-premium p-5 rounded-2xl border border-gold-500/10 text-left w-52 shadow-lg animate-float" style={{ animationDelay: '3s' }}>
              <div className="flex items-center gap-2.5 mb-2">
                <Music size={16} className="text-gold-500" />
                <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase">Auto Play Audio</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Alunan musik latar romantis yang langsung menyambut kehadiran para tamu.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fitur" className="py-28 border-t border-slate-900 bg-[#020b18]/40 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold-500 block mb-3">FITUR UTAMA PLATFORM</span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white">
              Dihias Keindahan Teknis
            </h2>
            <div className="w-16 h-[1px] bg-gold-500/30 mx-auto mt-4" />
            <p className="text-slate-400 mt-4 text-xs sm:text-sm leading-relaxed">
              Kami menyertakan seluruh fitur eksklusif untuk memastikan tamu undangan Anda mendapatkan pengalaman menyentuh dan mewah saat membuka tautan undangan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-3xl glass-premium flex gap-5 items-start hover:border-gold-500/30 transition-premium group"
              >
                <div className="p-4 bg-sapphire-950 border border-gold-500/10 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-white text-base mb-2 group-hover:text-gold-400 transition-colors">{feat.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="tema" className="py-28 border-t border-slate-900 bg-[#01070e] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold-500 block mb-3">EXCLUSIVE TEMPLATES</span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white">
              Arsitektur Tema Berselera Tinggi
            </h2>
            <div className="w-16 h-[1px] bg-gold-500/30 mx-auto mt-4" />
            <p className="text-slate-400 mt-4 text-xs sm:text-sm leading-relaxed">
              Tiap konsep tema dirancang secara matang dengan paduan warna artistik, tipografi elegan, dan transisi sehalus sutra.
            </p>
          </div>

          {/* Interactive Showcase Carousel Panel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl border border-gold-500/10 shadow-2xl relative aspect-[16/10] sm:aspect-[16/9] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTemplateIdx}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Backdrop Zooming Image */}
                  <img
                    src={templates[activeTemplateIdx].image}
                    alt={templates[activeTemplateIdx].name}
                    className="object-cover w-full h-full brightness-50"
                  />
                  
                  {/* Gold Border Card Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#01070e] via-transparent to-transparent flex flex-col justify-end p-8 sm:p-12 text-left" />
                  
                  {/* Template Details Floating Box */}
                  <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 text-left z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="max-w-md">
                      <span className="inline-block px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[9px] font-bold tracking-widest uppercase mb-3">
                        {templates[activeTemplateIdx].badge}
                      </span>
                      <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
                        {templates[activeTemplateIdx].name}
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {templates[activeTemplateIdx].desc}
                      </p>
                    </div>
                    
                    <a
                      href={templates[activeTemplateIdx].demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-sapphire-950 font-black text-xs tracking-wider uppercase transition-premium flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-lg shadow-gold-500/10"
                    >
                      <span>Demo Live</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Buttons */}
            <button
              onClick={prevTemplate}
              className="absolute left-[-20px] sm:left-[-30px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-premium border border-gold-500/20 text-gold-500 hover:text-gold-400 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextTemplate}
              className="absolute right-[-20px] sm:right-[-30px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-premium border border-gold-500/20 text-gold-500 hover:text-gold-400 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg hover:scale-105"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-28 border-t border-slate-900 bg-[#020b18]/30 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gold-500 block mb-3">TESTIMONI PASANGAN</span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white">
              Kisah Bahagia Mereka
            </h2>
            <div className="w-16 h-[1px] bg-gold-500/30 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-8 rounded-3xl glass-premium border border-gold-500/10 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed italic mb-6">
                    "{testi.quote}"
                  </p>
                </div>
                <div>
                  <h4 className="font-cinzel font-bold text-white text-sm">{testi.name}</h4>
                  <span className="text-[10px] text-gold-500 font-bold tracking-wider uppercase block mt-0.5">{testi.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section className="py-28 bg-[#01070e] border-t border-slate-900 px-6 text-center">
        <div className="max-w-4xl mx-auto glass-premium p-10 sm:p-20 rounded-[3rem] border border-gold-500/15 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Light Grid */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-sapphire-600/10 rounded-full filter blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white mb-6 leading-tight">
            Abadikan Setiap Momen <br />
            Hari Bahagia Anda
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-10">
            Daftarkan diri Anda hari ini dan bagikan kemewahan undangan digital Anda secara kustom kepada seluruh keluarga serta kerabat tercinta.
          </p>

          <div className="max-w-xs mx-auto">
            <Link
              href="/register"
              className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 font-black text-xs tracking-widest uppercase transition-premium flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-500/10 border border-gold-300/20"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#01060c] text-slate-500 py-16 px-6 border-t border-slate-900 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-sapphire-950 border border-gold-500/20 rounded-full overflow-hidden shadow-inner">
                <img src="/logo1.png" alt="MBNP Logo" className="w-4 h-4 object-contain drop-shadow-[0_0_8px_rgba(8,80,144,0.6)]" />
              </div>
              <span className="font-cinzel text-base font-bold tracking-[0.2em] text-white">
                MBNP <span className="text-gold-500">INVITE</span>
              </span>
            </div>
            <p className="text-slate-400 text-[10px] sm:text-xs text-center md:text-left leading-relaxed max-w-sm">
              SaaS Undangan Pernikahan Digital Kelas Premium. Merancang kemewahan visual untuk perayaan hari bersejarah Anda.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <p>© 2026 MBNP Invite. All rights reserved. MBNP Technology Group.</p>
            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <a href="#fitur" className="hover:text-gold-500 transition-colors">Fitur</a>
              <span>•</span>
              <a href="#tema" className="hover:text-gold-500 transition-colors">Tema</a>
              <span>•</span>
              <a href="#testimoni" className="hover:text-gold-500 transition-colors">Testimoni</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
