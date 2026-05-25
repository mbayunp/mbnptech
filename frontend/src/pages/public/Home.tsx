// src/pages/public/Home.tsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Monitor, BarChart2, Zap, Shield,
  Search, Layout, Code2, Send, ArrowRight, ArrowUpRight
} from 'lucide-react';
import { fadeUp, stagger } from '../../utils/animations';
import MagneticGlowCard from '../../components/MagneticGlowCard';

// === HERO ===
const HeroSection = () => (
  <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#030712] transition-colors duration-300">
    {/* Mesh Gradient Blobs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-400/25 to-indigo-400/10 dark:from-blue-500/15 dark:to-indigo-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-[30%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-bl from-violet-400/20 to-sky-300/10 dark:from-violet-500/15 dark:to-sky-500/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-[10%] left-[20%] w-[55%] h-[50%] bg-gradient-to-tr from-emerald-300/15 to-cyan-400/10 dark:from-emerald-500/10 dark:to-cyan-500/5 rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-5 md:px-8 relative z-10 pt-8">
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="max-w-5xl mx-auto text-center"
      >
        {/* Live Badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-sm mb-10 hover:bg-white dark:hover:bg-white/10 hover:scale-105 transition-all cursor-default">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
          </span>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-widest uppercase">MBNP Tech • IT Solutions</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-black text-slate-900 dark:text-white tracking-tighter mb-7 leading-[1.04]">
          Membangun Ekosistem <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Digital Terskalabel
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Mentransformasi ide kompleks menjadi sistem informasi modern, super cepat, dan impact-driven untuk Bisnis & Pemerintahan.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/contact" className="group relative w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-base overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/25 dark:hover:shadow-white/10 flex justify-center items-center gap-2.5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Mulai Kolaborasi</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/projects" className="w-full sm:w-auto px-8 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 rounded-2xl font-bold text-base hover:bg-white dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:scale-105 shadow-sm flex justify-center items-center gap-2">
            Lihat Portfolio <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === FEATURES BENTO GRID ===
const bentoItems = [
  {
    icon: <Monitor size={24} />, label: 'Enterprise Web Apps', wide: true, dark: true,
    desc: 'Sistem web kompleks (React, Express) yang scalable, terstruktur, dan siap untuk enterprise.',
    bg: 'bg-gradient-to-br from-slate-900 to-[#0B1120] dark:from-[#0B0F19] dark:to-[#030712]', iconBg: 'bg-white/10 text-white', glow: 'rgba(59, 130, 246, 0.15)',
  },
  {
    icon: <BarChart2 size={20} />, label: 'Portal Data', wide: false, dark: false,
    desc: 'Dashboard & open data portal untuk Pemerintah.',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:bg-none', iconBg: 'bg-blue-600 text-white', glow: 'rgba(99, 102, 241, 0.12)',
  },
  {
    icon: <Zap size={20} />, label: 'Modern UI/UX', wide: false, dark: false,
    desc: 'Eksplorasi antarmuka estetik yang interaktif.',
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 dark:bg-none', iconBg: 'bg-emerald-500 text-white', glow: 'rgba(16, 185, 129, 0.12)',
  },
  {
    icon: <Shield size={20} />, label: 'Sistem Pemerintahan (SPBE)', wide: true, dark: false,
    desc: 'Penerapan clean code rules menjamin sistem yang cepat, aman, dan mudah di-maintain.',
    bg: 'bg-white dark:bg-[#0B0F19]', iconBg: 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300', glow: 'rgba(59, 130, 246, 0.08)',
  },
];

const FeaturesBentoSection = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-[#030712] relative z-20 -mt-8 md:-mt-12 rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-slate-100 dark:border-white/[0.05] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] transition-colors duration-300">
    <div className="container mx-auto px-5 md:px-8 max-w-6xl">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Layanan Unggulan</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Expertise Teknologi Modern</motion.h2>
        <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-4">Solusi komprehensif dari perancangan arsitektur hingga deployment produksi.</motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {bentoItems.map((item, i) => (
          <MagneticGlowCard
            key={i}
            glowColor={item.glow}
            hoverScale={1.02}
            className={`${item.bg} ${item.wide ? 'md:col-span-2' : ''} border ${item.dark ? 'border-slate-800 dark:border-white/10' : 'border-slate-100 dark:border-white/[0.05]'} !p-0`}
          >
            <div className="p-5 md:p-10 h-full flex flex-col justify-between min-h-[220px]">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBg} shadow-inner mb-5`}>{item.icon}</div>
              <div>
                <h3 className={`font-display text-xl md:text-2xl font-black mb-2 ${item.dark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</h3>
                <p className={`text-sm md:text-base leading-relaxed max-w-sm ${item.dark ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{item.desc}</p>
              </div>
            </div>
          </MagneticGlowCard>
        ))}
      </div>
    </div>
  </section>
);

// === FEATURED PROJECT ===
const FeaturedProjectSection = () => (
  <section className="py-20 md:py-28 bg-slate-50 dark:bg-[#0B0F19] border-y border-slate-100 dark:border-white/[0.05] relative overflow-hidden transition-colors duration-300">
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute top-[-15%] left-[40%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-[100px]" />
    </div>
    <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
      <div className="mb-12 md:mb-16 md:flex md:items-end md:justify-between text-center md:text-left">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="max-w-2xl mx-auto md:mx-0">
          <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Showcase Utama</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Karya Terbaik Tersorot</motion.h2>
        </motion.div>
        <div className="mt-6 md:mt-0 hidden md:block">
          <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm text-sm">
            Semua Portfolio <ArrowRight size={14} className="text-blue-600" />
          </Link>
        </div>
      </div>

      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="bg-[#0F172A] dark:bg-[#030712] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-14 flex flex-col lg:flex-row gap-8 md:gap-12 items-center relative overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-800 dark:border-white/10"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="w-full lg:w-[45%] relative z-10 text-center lg:text-left pt-4 lg:pt-0">
          <div className="inline-block px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-5">Creative Portfolio Studio</div>
          <h3 className="font-display text-3xl md:text-5xl font-black text-white mb-4 md:mb-5 leading-tight">Picme Studio</h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-7">
            Platform portfolio interaktif dengan performa render dinamis yang dirancang khusus untuk menampilkan layanan fotografi studio kreatif secara elegan.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
            {['React', 'Express.js', 'Tailwind', 'Dynamic Gallery'].map((t, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs font-medium">{t}</span>
            ))}
          </div>
          <a href="https://picmestudio.id/" target="_blank" rel="noopener noreferrer" className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 px-7 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30">
            Kunjungi Website <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="w-full lg:w-[55%] relative z-10">
          <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="rounded-2xl bg-slate-800/80 border border-slate-700/80 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="h-9 bg-slate-900 border-b border-slate-700/80 dark:border-slate-800 flex items-center px-4 gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <div className="ml-4 flex-1 flex justify-center">
                <div className="w-1/2 h-5 bg-slate-800 dark:bg-slate-900 rounded-md border border-slate-700 dark:border-slate-800 text-[9px] text-slate-500 flex items-center justify-center tracking-widest font-mono">picmestudio.id</div>
              </div>
            </div>
            <div className="relative overflow-hidden aspect-[4/3] bg-slate-900">
              <img src="/p1.jpeg" alt="Picme Preview" className="w-full h-full object-cover object-top" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// === OTHER PROJECTS ===
const projects = [
  { title: 'Portal Garut Satu Data', category: 'Government', tech: ['React', 'PHP API'] },
  { title: 'IMN Business Group', category: 'Corporate', tech: ['React', 'Express.js'] },
  { title: 'Statistik Diskominfo', category: 'Internal App', tech: ['Next.js', 'MySQL'] },
];

const OtherProjectsSection = () => (
  <section className="py-20 bg-white dark:bg-[#030712] transition-colors duration-300">
    <div className="container mx-auto px-5 md:px-8 max-w-6xl">
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-10 text-center">
        Lebih Banyak Projek
      </motion.h2>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {projects.map((p, i) => (
          <MagneticGlowCard key={i} glowColor="rgba(59, 130, 246, 0.08)" hoverScale={1.02}
            className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-white/[0.05] rounded-[2rem] hover:shadow-xl transition-all duration-300 cursor-default">
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-lg mb-4">{p.category}</span>
            <h3 className="font-display text-lg md:text-xl font-black text-slate-800 dark:text-white mb-4">{p.title}</h3>
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t, idx) => <span key={idx} className="bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md">{t}</span>)}
            </div>
          </MagneticGlowCard>
        ))}
      </motion.div>
    </div>
  </section>
);

// === FLOW SECTION ===
const flowSteps = [
  { n: '01', icon: <Search size={20} />, t: 'Diskusi & Riset', d: 'Memahami visi dan kebutuhan kompleks sistem Anda.' },
  { n: '02', icon: <Layout size={20} />, t: 'Arsitektur', d: 'Merancang fondasi UI/UX dan struktur database yang kokoh.' },
  { n: '03', icon: <Code2 size={20} />, t: 'Development', d: 'Membangun dengan teknologi terbaru dan clean code.' },
  { n: '04', icon: <Send size={20} />, t: 'Deploy & Scale', d: 'Uji coba menyeluruh dan perilisan ke production.' },
];

const FlowSection = () => (
  <section className="py-20 md:py-28 bg-[#0F172A] dark:bg-[#030712] text-white overflow-hidden relative border-t border-slate-800 dark:border-white/10 transition-colors duration-300">
    <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-700/15 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="mb-14 md:mb-16 md:w-1/2 text-center md:text-left">
        <motion.p variants={fadeUp} className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Eksekusi Tanpa Kompromi</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-white tracking-tight">Alur Kerja Sistematis</motion.h2>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {flowSteps.map((s, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative group text-center md:text-left border-b md:border-none border-slate-800 dark:border-white/5 pb-6 md:pb-0 last:border-none">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-4 mx-auto md:mx-0 group-hover:bg-blue-600/20 transition-colors">{s.icon}</div>
            <div className="text-4xl md:text-5xl font-black text-slate-800/70 dark:text-slate-700/40 mb-2 group-hover:text-blue-500/20 transition-colors">{s.n}</div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">{s.t}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs mx-auto md:mx-0">{s.d}</p>
            {idx < 3 && <div className="hidden md:block absolute top-12 left-16 right-4 h-[1px] bg-gradient-to-r from-slate-700 dark:from-slate-800 to-transparent" />}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === FINAL CTA ===
const ModernCTAButton = () => (
  <section className="py-24 md:py-36 bg-white dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-300">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-blue-100/60 to-violet-100/40 dark:from-blue-950/20 dark:to-violet-950/10 rounded-full blur-3xl -z-10" />
    <div className="container mx-auto px-5 md:px-8 max-w-4xl text-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 tracking-tighter">
          Siap Kolaborasi <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Level Selanjutnya?</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 md:mb-14 max-w-2xl mx-auto font-medium">
          Jadwalkan diskusi santai tentang visi digital Anda dan mari buat eksekusi yang nyata.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black dark:hover:bg-slate-100 hover:shadow-2xl hover:shadow-slate-900/25 dark:hover:shadow-white/10 hover:-translate-y-1 transition-all border border-slate-700 dark:border-white/10 shadow-xl w-full sm:w-auto">
            Konsultasi Sekarang
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === MAIN ===
const Home = () => (
  <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900 dark:bg-[#030712] transition-colors duration-300">
    <Helmet>
      <title>MBNP Tech - Solusi Website Profesional & Ekosistem Digital Terskalabel</title>
      <meta name="description" content="Transformasi ide kompleks menjadi sistem informasi modern, super cepat, dan impact-driven untuk Bisnis & Pemerintahan." />
    </Helmet>
    <HeroSection />
    <FeaturesBentoSection />
    <FeaturedProjectSection />
    <OtherProjectsSection />
    <FlowSection />
    <ModernCTAButton />
  </div>
);

export default Home;