// src/pages/public/Projects.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiExternalLink, FiCheck, FiCode, FiServer, FiDatabase,
  FiZap, FiTrendingUp, FiShield, FiUsers, FiArrowRight, FiArrowUpRight
} from 'react-icons/fi';
import { fadeUp, stagger } from '../../utils/animations';

// === HERO ===
const ProjectsHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center pb-16 overflow-hidden bg-[#fafafa]">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-5%] left-[45%] -translate-x-1/2 w-[70%] h-[65%] bg-gradient-to-br from-blue-400/20 to-indigo-300/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[15%] w-[55%] h-[45%] bg-gradient-to-tr from-violet-300/10 to-indigo-400/10 rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-5 md:px-8 relative z-10 pt-16 md:pt-20 text-center">
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
          </span>
          <span className="text-xs font-black text-slate-700 tracking-widest uppercase">Our Best Work</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-black text-slate-900 tracking-tighter mb-6 leading-[1.04]">
          Projects & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">Portfolio</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-base md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Kumpulan ekosistem digital, portal data, dan sistem web enterprise yang dirancang dengan performa, keamanan, dan skalabilitas tinggi.
        </motion.p>

        <motion.div variants={fadeUp}>
          <a href="#portfolio" className="group inline-flex items-center justify-center gap-2.5 px-9 py-4.5 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-black hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-1 transition-all w-full sm:w-auto border border-slate-700">
            Eksplorasi Karya <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === FEATURED PROJECTS ===
const featuredProjects = [
  {
    title: 'Portal Garut Satu Data', category: 'Government Portal',
    tech: ['React', 'PHP API', 'Tailwind'],
    desc: 'Platform data terpadu resmi Pemerintah Kabupaten Garut. Menyediakan akses informasi data publik secara transparan dan terstruktur dengan visualisasi statistik.',
    features: ['Publikasi dataset statistik', 'Manajemen infografis', 'Dashboard administrasi data'],
    link: 'https://bidangstatistik.garutkab.go.id/', image: '/1.jpeg', tagColor: 'blue',
  },
  {
    title: 'UKBI Garut 2026 Monitoring', category: 'Government System',
    tech: ['React', 'Node.js', 'Express.js', 'MySQL'],
    desc: 'Sistem digital pemantauan kuota dan verifikasi pendaftar UKBI. Dashboard admin real-time untuk memvalidasi berkas ribuan peserta secara efisien.',
    features: ['Monitoring kuota peserta', 'Verifikasi berkas digital', 'Status kelulusan real-time'],
    link: 'https://ukbigarut2026.garutkab.go.id', image: '/2.jpeg', tagColor: 'emerald',
  },
  {
    title: 'Picme Studio', category: 'Creative Platform',
    tech: ['React', 'Express.js', 'Dynamic Render'],
    desc: 'Platform portfolio interaktif untuk studio kreatif profesional. Mengedepankan performa render gambar cepat dan animasi dinamis untuk memukau calon klien fotografi.',
    features: ['Portfolio karya dinamis', 'Katalog layanan premium', 'CMS Kustom untuk Studio'],
    link: 'https://picmestudio.id/', image: '/3.jpeg', tagColor: 'fuchsia',
  },
  {
    title: 'IMN Business Group', category: 'Corporate Website',
    tech: ['React', 'Express.js', 'SEO Optimized'],
    desc: 'Website profil perusahaan B2B berskala nasional. Dirancang untuk menonjolkan kredibilitas perusahaan dan mempermudah akuisisi klien melalui UI yang elegan.',
    features: ['Profil perusahaan B2B', 'Integrasi kontak langsung', 'Desain eksklusif & responsif'],
    link: 'https://imnbusinessgroup.co.id/', image: '/4.jpeg', tagColor: 'indigo',
  },
];

const tagColorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  fuchsia: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

const FeaturedProjects = () => (
  <section id="portfolio" className="py-20 md:py-28 bg-white relative z-20 -mt-8 rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-slate-100 overflow-hidden">
    <div className="absolute top-[-8%] right-[5%] w-[400px] h-[400px] bg-gradient-to-br from-indigo-50/80 to-violet-50/30 rounded-full blur-[130px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-7xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Portfolio</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Showcase Karya Terbaik</motion.h2>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {featuredProjects.map((project, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.015, y: -6 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow duration-500 flex flex-col group cursor-default">
            <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
              <img src={project.image} alt={`Tangkapan layar ${project.title}`} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-5 md:p-10 flex flex-col flex-grow">
              <div className="flex flex-wrap justify-between items-start mb-5 gap-3">
                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl border ${tagColorMap[project.tagColor]}`}>{project.category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t, i) => <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-lg border border-slate-200">{t}</span>)}
                </div>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{project.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-7 text-sm md:text-base font-medium flex-grow">{project.desc}</p>
              <div className="mb-7">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-black">Highlight Fitur:</p>
                <ul className="space-y-2">
                  {project.features.map((f, i) => (
                    <li key={i} className="text-sm text-slate-700 font-semibold flex items-start gap-2.5">
                      <FiCheck className="text-emerald-500 mt-0.5 shrink-0" /><span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01]">
                Kunjungi Website <FiExternalLink className="opacity-70" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === TECH STACK ===
const techStacks = [
  { icon: <FiCode size={22} />, title: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'], bg: 'from-blue-50 to-indigo-50/50', iconBg: 'bg-blue-600 text-white' },
  { icon: <FiServer size={22} />, title: 'Backend', items: ['Node.js', 'Express.js', 'PHP', 'Laravel API'], bg: 'from-violet-50 to-indigo-50/50', iconBg: 'bg-violet-600 text-white' },
  { icon: <FiDatabase size={22} />, title: 'Database', items: ['MySQL', 'PostgreSQL', 'Redis'], bg: 'from-emerald-50 to-teal-50/50', iconBg: 'bg-emerald-600 text-white' },
  { icon: <FiZap size={22} />, title: 'Deployment', items: ['Linux VPS', 'Nginx', 'Docker', 'CI/CD'], bg: 'from-amber-50 to-orange-50/50', iconBg: 'bg-amber-500 text-white' },
];

const TechHighlight = () => (
  <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-tl from-violet-100/30 to-indigo-50/30 rounded-full blur-[130px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Tech Stack</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Teknologi Dibalik Layar</motion.h2>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {techStacks.map((cat, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.04, y: -5 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`p-5 md:p-9 rounded-[2.5rem] bg-gradient-to-br ${cat.bg} border border-white/80 text-left hover:shadow-xl hover:shadow-slate-200/60 transition-shadow duration-500 group cursor-default`}>
            <div className={`w-12 h-12 ${cat.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>{cat.icon}</div>
            <h3 className="font-display text-lg font-black text-slate-900 mb-4">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === PROJECT IMPACT ===
const impacts = [
  { icon: <FiTrendingUp size={20} />, title: 'Transparansi Data', text: 'Meningkatkan aksesibilitas data publik bagi masyarakat dan stakeholder.' },
  { icon: <FiCode size={20} />, title: 'Otomatisasi Sistem', text: 'Memangkas waktu birokrasi dan administrasi manual secara signifikan.' },
  { icon: <FiShield size={20} />, title: 'Kredibilitas Digital', text: 'Mengangkat citra profesional organisasi melalui UI/UX berstandar global.' },
  { icon: <FiUsers size={20} />, title: 'User Experience', text: 'Menjamin kemudahan navigasi bagi end-user dari segala kalangan usia.' },
];

const ProjectImpact = () => (
  <section className="py-20 md:py-28 bg-[#0F172A] text-white relative overflow-hidden">
    <div className="absolute top-[-10%] right-[10%] w-[500px] h-[400px] bg-blue-700/15 rounded-full blur-[150px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[350px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl flex flex-col lg:flex-row gap-12 md:gap-16 items-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="w-full lg:w-1/2 text-center lg:text-left">
        <motion.p variants={fadeUp} className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Value & Outcome</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black mb-6 tracking-tight">Dampak Nyata dari Setiap Baris Kode</motion.h2>
        <motion.p variants={fadeUp} className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
          Kami tidak sekadar menulis kode. Kami membangun sistem digital yang dirancang untuk memecahkan masalah nyata, meningkatkan efisiensi operasional, dan memperkuat posisi brand Anda di era digital.
        </motion.p>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {impacts.map((impact, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.03, y: -3 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 cursor-default">
            <div className="w-10 h-10 bg-blue-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-4">{impact.icon}</div>
            <h3 className="font-display font-bold text-white mb-2">{impact.title}</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{impact.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === CTA ===
const ProjectsCTA = () => (
  <section className="py-24 md:py-36 bg-white relative overflow-hidden border-t border-slate-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-indigo-100/50 to-blue-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-4xl text-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
          Siap Membangun <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Proyek Anda?</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
          Jangan biarkan ide hebat Anda hanya sebatas rencana. Mari wujudkan menjadi ekosistem digital yang nyata bersama kami.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/contact" className="group inline-flex items-center justify-center gap-2 px-9 py-4.5 bg-slate-900 text-white rounded-2xl font-black text-base hover:bg-black hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-1 transition-all w-full sm:w-auto">
            Mulai Diskusi <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-9 py-4.5 bg-white text-slate-800 border border-slate-200 rounded-2xl font-black text-base hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 w-full sm:w-auto shadow-sm">
            WhatsApp Saya <FiArrowUpRight />
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Projects = () => (
  <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
    <ProjectsHero />
    <FeaturedProjects />
    <TechHighlight />
    <ProjectImpact />
    <ProjectsCTA />
  </div>
);

export default Projects;