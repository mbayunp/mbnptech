// src/pages/public/Services.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGlobe, FiCpu, FiBarChart2, FiBriefcase, FiTool,
  FiCheck, FiArrowRight, FiChevronDown, FiArrowUpRight
} from 'react-icons/fi';
import { fadeUp, stagger } from '../../utils/animations';
import MagneticGlowCard from '../../components/MagneticGlowCard';

// === HERO ===
const ServicesHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center pb-16 overflow-hidden bg-[#0B1120] text-white">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-600/25 to-indigo-600/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[55%] bg-gradient-to-tl from-violet-600/20 to-sky-400/10 rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-5 md:px-8 relative z-10 pt-16 md:pt-20 text-center">
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
          </span>
          <span className="text-xs font-black text-sky-300 tracking-widest uppercase">Layanan Utama Kami</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-black text-white tracking-tighter mb-6 leading-[1.04]">
          Professional Web <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-50 to-indigo-500">Development</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-base md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Membantu bisnis, organisasi, dan instansi pemerintahan membangun ekosistem digital yang efektif, interaktif, dan scalable.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/contact" className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-500 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30 flex justify-center items-center gap-2">
            Konsultasi Proyek <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/projects" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-2xl font-bold text-base hover:bg-white/10 transition-all hover:scale-105 flex justify-center items-center gap-2">
            Lihat Portfolio <FiArrowUpRight />
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-semibold text-slate-400">
          {['Modern Tech Stack', 'Scalable System', 'Clean Architecture'].map((t, i) => (
            <span key={i} className="flex items-center gap-2"><FiCheck className="text-sky-400" />{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === CORE SERVICES BENTO ===
const coreServices = [
  { icon: <FiGlobe size={22} />, title: 'Website Development', desc: 'Pembuatan website profesional untuk perusahaan, organisasi, dan instansi pemerintahan.', features: ['Responsive design', 'SEO friendly', 'Fast performance', 'Modern CMS'], examples: 'Company profile, Web instansi, Landing pages', accent: 'blue' },
  { icon: <FiCpu size={22} />, title: 'Web App Development', desc: 'Pengembangan aplikasi berbasis web (SaaS / Internal App) untuk otomatisasi operasional.', features: ['React & Node.js', 'Custom Workflow', 'Role Management', 'API Integration'], examples: 'Sistem absensi, ERP, Sistem administrasi', accent: 'indigo' },
  { icon: <FiBarChart2 size={22} />, title: 'Data Portal & Dashboard', desc: 'Portal data terpusat dan dashboard visualisasi untuk pengambilan keputusan strategis.', features: ['Grafik interaktif', 'Manajemen dataset', 'Real-time analytics', 'Export reporting'], examples: 'Portal statistik, Open data, Dashboard monitoring', accent: 'violet' },
  { icon: <FiBriefcase size={22} />, title: 'Corporate Website', desc: 'Identitas digital perusahaan untuk meningkatkan kredibilitas B2B maupun B2C.', features: ['Desain eksklusif', 'Katalog layanan', 'Portfolio showcase', 'Lead generation'], examples: 'Situs korporasi, Agensi kreatif', accent: 'emerald' },
  { icon: <FiTool size={22} />, title: 'Maintenance & Scale Up', desc: 'Perbaikan bug, refactoring kode, dan pengembangan fitur baru pada sistem existing.', features: ['Optimasi performa', 'Security patch', 'Server monitoring', 'Version upgrade'], examples: 'Retainer bulanan, On-demand support', accent: 'amber' },
];

const accentMap: Record<string, { icon: string; tag: string; glow: string }> = {
  blue: { icon: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400', tag: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/30', glow: 'rgba(59, 130, 246, 0.12)' },
  indigo: { icon: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400', tag: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30', glow: 'rgba(99, 102, 241, 0.12)' },
  violet: { icon: 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400', tag: 'bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/30', glow: 'rgba(139, 92, 246, 0.12)' },
  emerald: { icon: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400', tag: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30', glow: 'rgba(16, 185, 129, 0.12)' },
  amber: { icon: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400', tag: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/30', glow: 'rgba(245, 158, 11, 0.12)' },
};

const CoreServices = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-[#030712] relative z-20 -mt-8 rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-slate-100 dark:border-white/[0.05] transition-colors duration-300">
    <div className="absolute top-[-5%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-indigo-100/40 to-violet-100/20 dark:from-indigo-950/10 dark:to-violet-950/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Core Services</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Keahlian & Spesialisasi</motion.h2>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {coreServices.map((srv, idx) => {
          const colors = accentMap[srv.accent];
          return (
            <MagneticGlowCard key={idx} glowColor={colors.glow} hoverScale={1.02}
              className="bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-white/[0.05] flex flex-col group cursor-default !p-0">
              <div className="p-5 md:p-9 flex flex-col h-full">
                <div className={`w-12 h-12 ${colors.icon} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{srv.icon}</div>
                <h3 className="font-display text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{srv.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed font-medium flex-grow">{srv.desc}</p>
                <div className="mb-5 bg-slate-50 dark:bg-[#030712] p-4 rounded-2xl border border-slate-100 dark:border-white/[0.05]">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 font-black">Fitur Kunci</p>
                  <ul className="space-y-1.5">
                    {srv.features.map((f, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                        <FiCheck className="text-emerald-500 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={`inline-block text-center px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border ${colors.tag}`}>{srv.examples}</span>
              </div>
            </MagneticGlowCard>
          );
        })}
      </motion.div>
    </div>
  </section>
);

// === INDUSTRY SOLUTIONS ===
const industries = [
  { title: 'Government / Pemerintahan', desc: 'Mendukung SPBE dengan portal data, website instansi, dan sistem administrasi yang aman.', example: 'Portal Statistik, Garut Satu Data' },
  { title: 'Creative & Studio', desc: 'Website portfolio berkinerja tinggi and platform interaktif untuk menampilkan karya secara elegan.', example: 'Picme Studio, Agency Web' },
  { title: 'Corporate / Perusahaan', desc: 'Profil perusahaan profesional untuk memperkuat citra brand di mata klien dan investor.', example: 'IMN Business Group' },
  { title: 'Organization & Education', desc: 'Sistem terintegrasi untuk manajemen komunitas, absensi, dan administrasi lembaga.', example: 'Sistem Absensi Geolocation' },
];

const IndustrySolutions = () => (
  <section className="py-20 md:py-28 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-100 dark:border-white/[0.05] relative overflow-hidden transition-colors duration-300">
    <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-gradient-to-tr from-sky-100/40 to-indigo-100/20 dark:from-sky-950/10 dark:to-indigo-950/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="mb-12 md:mb-16 md:w-2/3">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Industry Solutions</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Menyelesaikan Masalah di Berbagai Sektor</motion.h2>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {industries.map((ind, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="bg-white dark:bg-[#030712] p-5 md:p-9 rounded-[2.5rem] border border-slate-100 dark:border-white/[0.05] flex flex-col md:flex-row gap-5 items-start hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-500 cursor-default group">
            <div className="text-5xl md:text-6xl font-black text-slate-100 dark:text-slate-900/80 leading-none shrink-0 group-hover:text-blue-100 dark:group-hover:text-blue-900/20 transition-colors">0{idx + 1}</div>
            <div>
              <h3 className="font-display text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">{ind.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium mb-4">{ind.desc}</p>
              <span className="inline-block px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-100 dark:border-blue-900/30">
                Use Case: {ind.example}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === DEVELOPMENT PROCESS ===
const processSteps = [
  { num: '1', title: 'Riset & Analisis', desc: 'Membedah kebutuhan bisnis dan tujuan utama sistem.' },
  { num: '2', title: 'System Architecture', desc: 'Merancang skema database, alur API, dan Wireframe UI/UX.' },
  { num: '3', title: 'Coding & Dev', desc: 'Implementasi kode dengan tumpukan teknologi modern (React/Node).' },
  { num: '4', title: 'UAT & Testing', desc: 'Pengujian fungsionalitas, keamanan, dan performa.' },
  { num: '5', title: 'Deployment', desc: 'Rilis ke server produksi dengan konfigurasi domain dan SSL.' },
  { num: '6', title: 'Support & Scale', desc: 'Pemeliharaan berkelanjutan dan optimasi skala besar.' },
];

const DevelopmentProcess = () => (
  <section className="py-20 md:py-28 bg-[#0F172A] dark:bg-[#030712] text-white overflow-hidden relative transition-colors duration-300">
    <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[150px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16">
        <motion.p variants={fadeUp} className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Development Workflow</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-white tracking-tight">SOP Standar Industri</motion.h2>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {processSteps.map((step, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="bg-slate-800/40 dark:bg-[#0B0F19]/40 backdrop-blur-sm p-5 md:p-9 rounded-[2.5rem] border border-slate-700/50 dark:border-white/[0.05] hover:bg-slate-800/70 dark:hover:bg-[#0B0F19]/70 hover:border-slate-600/50 dark:hover:border-white/10 transition-all duration-300 relative overflow-hidden group cursor-default">
            <div className="absolute top-5 right-7 text-5xl font-black text-slate-700/25 dark:text-slate-800/20 group-hover:text-blue-500/10 transition-colors">{step.num}</div>
            <div className="relative z-10 mt-8">
              <h3 className="font-display text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === MAINTENANCE SECTION ===
const MaintenanceSupport = () => (
  <section className="py-20 md:py-28 bg-white dark:bg-[#030712] transition-colors duration-300">
    <div className="container mx-auto px-5 md:px-8 max-w-6xl">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-500/20 dark:border-white/[0.05] rounded-[2.5rem] md:rounded-[3rem] p-5 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20 flex flex-col lg:flex-row gap-10 md:gap-16 items-center">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-900/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">Long-term Partner</div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-4 md:mb-5 tracking-tight">Maintenance & Support</h2>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed font-medium">
            Pengembangan aplikasi tidak berhenti saat hari peluncuran. Kami memastikan ekosistem digital Anda tetap aman, ter-update, dan berkinerja maksimal setiap harinya.
          </p>
        </div>
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="bg-white/10 dark:bg-white/5 p-5 md:p-9 rounded-[2rem] backdrop-blur-md border border-white/20 dark:border-white/10">
            <h3 className="font-display font-black text-lg md:text-xl mb-6">Paket Layanan Termasuk:</h3>
            <ul className="space-y-4">
              {['Update Teknologi & Keamanan Framework', 'Monitoring Server & Database Backup', 'Pemecahan Masalah (Bug Fixing) Cepat', 'Penambahan Modul & Skalabilitas Fitur'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-medium text-sm text-blue-50">
                  <FiCheck className="text-sky-300 mt-0.5 shrink-0 text-base" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// === FAQ ===
const faqs = [
  { q: 'Berapa estimasi biaya pembuatan sistem atau website?', a: 'Biaya sangat bergantung pada tingkat kompleksitas fitur, jumlah halaman, dan infrastruktur server yang digunakan. Silakan jadwalkan konsultasi gratis agar kami dapat menyusun Rencana Anggaran Biaya (RAB) yang presisi untuk Anda.' },
  { q: 'Berapa lama timeline pengerjaan rata-rata?', a: 'Untuk website company profile biasanya memakan waktu 2-3 minggu. Sedangkan untuk web app/sistem informasi kompleks (seperti ERP atau portal data) membutuhkan waktu 4-12 minggu.' },
  { q: 'Apakah MBNP Tech menerima perbaikan/scale-up sistem existing?', a: 'Tentu. Kami sering menangani proses refactoring kode, migrasi database, perbaikan bug kritis, hingga penambahan fitur pada sistem legacy (yang sudah ada sebelumnya).' },
];

const ServicesFAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <section className="py-20 md:py-28 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-100 dark:border-white/[0.05] relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-blue-50/80 dark:bg-blue-950/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-5 md:px-8 max-w-3xl relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-12 md:mb-14">
          <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Pertanyaan Umum</motion.h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={fadeUp}
              className={`bg-white dark:bg-[#030712] rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-blue-300 dark:border-blue-900/50 shadow-lg shadow-blue-100/50 dark:shadow-none' : 'border-slate-200 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/10'}`}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left">
                <span className={`font-bold text-base pr-4 transition-colors ${openFaq === index ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'}`}>
                  <FiChevronDown className="text-sm" />
                </div>
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm border-t border-slate-50 dark:border-white/[0.05]">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// === CTA ===
const ServicesCTA = () => (
  <section className="py-24 md:py-36 bg-white dark:bg-[#030712] relative overflow-hidden border-t border-slate-100 dark:border-white/[0.05] transition-colors duration-300">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-sky-100/60 to-blue-100/40 dark:from-sky-950/20 dark:to-blue-950/10 rounded-full blur-3xl -z-10 pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-4xl text-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
          Siap Memulai <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500">Proyek Anda?</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
          Ceritakan kebutuhan spesifik organisasi Anda, dan mari kita rancang arsitektur sistem digital yang sempurna bersama-sama.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black dark:hover:bg-slate-100 hover:shadow-2xl hover:shadow-slate-900/25 dark:hover:shadow-white/[0.05] shadow-xl w-full sm:w-auto">
            Jadwalkan Konsultasi <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900 dark:bg-[#030712] transition-colors duration-300">
    <ServicesHero />
    <CoreServices />
    <IndustrySolutions />
    <DevelopmentProcess />
    <MaintenanceSupport />
    <ServicesFAQ />
    <ServicesCTA />
  </div>
);

export default Services;