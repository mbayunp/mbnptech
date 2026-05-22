// src/pages/public/About.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCode, FiServer, FiDatabase, FiTool, FiCheck,
  FiLinkedin, FiMail, FiMessageSquare, FiEye, FiTarget, FiArrowRight, FiMapPin, FiUser
} from 'react-icons/fi';
import { fadeUp, stagger } from '../../utils/animations';

// === HERO ===
const AboutHero = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center pb-16 overflow-hidden bg-[#fafafa]">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-[10%] -right-[10%] w-[65%] h-[65%] bg-gradient-to-bl from-blue-400/20 to-indigo-300/10 rounded-full blur-[130px]" />
      <div className="absolute -bottom-[10%] left-[10%] w-[60%] h-[50%] bg-gradient-to-tr from-violet-300/15 to-indigo-400/10 rounded-full blur-[120px]" />
    </div>

    <div className="container mx-auto px-5 md:px-8 relative z-10 pt-16 md:pt-20 text-center">
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
          </span>
          <span className="text-xs font-black text-slate-700 tracking-widest uppercase">Kisah Kami</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-black text-slate-900 tracking-tighter mb-6 leading-[1.04]">
          Tentang <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">MBNP Tech</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-base md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Berfokus pada pengembangan sistem informasi berbasis web dan platform digital yang efektif, modern, dan terskalabel.
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// === ABOUT SECTION ===
const AboutMBNPTech = () => (
  <section className="py-20 md:py-28 bg-white relative z-20 -mt-8 rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-slate-100 overflow-hidden">
    <div className="absolute top-[-5%] right-[5%] w-[400px] h-[300px] bg-gradient-to-br from-blue-50/80 to-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="bg-slate-50 border border-slate-100 rounded-[2.5rem] md:rounded-[3rem] p-5 md:p-16 relative overflow-hidden hover:shadow-xl transition-shadow duration-500">
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] md:[mask-image:linear-gradient(to_left,white,transparent)] pointer-events-none opacity-50" />
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center relative z-10">
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-white p-4 rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 mb-6">
              <img src="/logo.png" alt="MBNP Tech Logo" className="h-16 md:h-20 w-auto object-contain" />
            </div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Platform Overview</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">What is MBNP Tech?</h2>
          </div>
          <div className="w-full md:w-2/3 space-y-4 md:space-y-5 text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            <p>MBNP Tech adalah platform pengembangan teknologi yang berfokus pada pembangunan website modern dan aplikasi berbasis web dengan pendekatan teknologi yang efisien dan scalable.</p>
            <p>Dikembangkan sebagai wadah untuk membangun solusi digital seperti website organisasi, portal data, sistem informasi, dan aplikasi berbasis web yang mendukung transformasi digital di berbagai sektor.</p>
            <p>Pendekatan kami menitikberatkan pada penggunaan teknologi modern, arsitektur sistem yang rapi, serta desain antarmuka yang responsif untuk pengalaman pengguna yang optimal.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// === FOUNDER PROFILE ===
const FounderProfile = () => (
  <section className="py-20 md:py-28 bg-[#0F172A] text-white relative overflow-hidden">
    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[150px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12 md:gap-16">
      {/* Founder Visual Card */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="w-full md:max-w-md md:mx-auto lg:max-w-none lg:w-1/3">
        <div className="aspect-[4/5] bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/80 flex flex-col items-center justify-center p-5 md:p-16 text-center shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Icon placeholder replacing emoji */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-slate-600 group-hover:border-blue-400 group-hover:scale-105 transition-all shadow-inner relative z-10">
            <FiUser size={52} className="text-blue-300 opacity-80" />
          </div>
          <h4 className="font-display text-2xl md:text-3xl font-black mb-2 relative z-10 tracking-tight">M. Bayu N.P.</h4>
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4 relative z-10">FullStack Developer</div>
          <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center gap-2 relative z-10">
            <FiMapPin size={12} className="text-blue-400 shrink-0" /> Bandung — Cianjur — Garut
          </p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="w-full lg:w-2/3 text-center md:text-left">
        <motion.p variants={fadeUp} className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Sang Pendiri</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 tracking-tight">Muhammad Bayu Nurdiansyah Putra</motion.h2>
        <motion.div variants={stagger} className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed mb-10 font-medium">
          <motion.p variants={fadeUp}>Berpengalaman dalam pengembangan sistem digital berbasis web selama lebih dari dua tahun. Lulusan Teknik Informatika dari UIN Bandung yang memiliki minat mendalam dalam modern web development.</motion.p>
          <motion.p variants={fadeUp}>Bayu berfokus pada pembangunan sistem informasi yang tidak hanya memiliki tampilan visual menarik, tetapi juga struktur arsitektur yang rapi, clean code, dan mudah dikembangkan untuk jangka panjang.</motion.p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center md:justify-start gap-3">
          {[
            { icon: <FiMail className="text-sky-400" />, label: 'Email', href: 'mailto:muhammadbayunp@gmail.com' },
            { icon: <FiMessageSquare className="text-green-400" />, label: 'WhatsApp', href: 'https://wa.me/6289663933263' },
            { icon: <FiLinkedin className="text-blue-400" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/mbayunp/' },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-3 rounded-full transition-all hover:scale-105 font-medium text-xs md:text-sm hover:border-white/20">
              {item.icon} {item.label}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === SKILLS & TECH STACK ===
const techStacks = [
  { icon: <FiCode size={22} />, title: 'Frontend', items: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS'], iconBg: 'bg-blue-600 text-white', bg: 'from-blue-50 to-indigo-50/50' },
  { icon: <FiServer size={22} />, title: 'Backend', items: ['Node.js', 'Express.js', 'PHP', 'Laravel'], iconBg: 'bg-violet-600 text-white', bg: 'from-violet-50 to-indigo-50/50' },
  { icon: <FiDatabase size={22} />, title: 'Database', items: ['MySQL', 'PostgreSQL', 'NoSQL Concepts'], iconBg: 'bg-emerald-600 text-white', bg: 'from-emerald-50 to-teal-50/50' },
  { icon: <FiTool size={22} />, title: 'Deployment', items: ['Git', 'Linux Server', 'Nginx', 'Cloud VPS'], iconBg: 'bg-amber-500 text-white', bg: 'from-amber-50 to-orange-50/50' },
];

const SkillsTech = () => (
  <section className="py-20 md:py-28 bg-white relative overflow-hidden">
    <div className="absolute top-[-5%] left-[30%] w-[500px] h-[400px] bg-gradient-to-br from-indigo-50/60 to-violet-50/30 rounded-full blur-[130px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-14 md:mb-16 max-w-3xl mx-auto">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Technology Stack</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Alat Kerja Kami</motion.h2>
        <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-500 font-medium">Menggunakan ekosistem teknologi modern untuk menjamin kecepatan, keamanan, dan skalabilitas sistem.</motion.p>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {techStacks.map((stack, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.04, y: -5 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`bg-gradient-to-br ${stack.bg} p-5 md:p-9 rounded-[2.5rem] border border-white/80 hover:shadow-xl hover:shadow-slate-200/60 transition-shadow duration-500 group cursor-default`}>
            <div className={`w-12 h-12 ${stack.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>{stack.icon}</div>
            <h3 className="font-display text-lg font-black text-slate-900 mb-4">{stack.title}</h3>
            <ul className="space-y-2">
              {stack.items.map((item, i) => (
                <li key={i} className="text-slate-600 font-medium text-xs flex items-center gap-2">
                  <FiCheck className="text-emerald-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === PROFESSIONAL VALUES ===
const values = [
  { title: 'Quality First', desc: 'Sistem dikembangkan dengan standar kualitas tinggi agar berjalan stabil dan andal.' },
  { title: 'Simplicity', desc: 'Solusi yang sederhana, bersih, namun sangat efektif menyelesaikan masalah nyata.' },
  { title: 'Scalability', desc: 'Arsitektur dirancang agar siap berkembang seiring bertumbuhnya bisnis Anda.' },
  { title: 'Continuous Learning', desc: 'Adaptasi konstan terhadap teknologi terbaru untuk hasil yang selalu maksimal.' },
];

const ProfessionalValues = () => (
  <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gradient-to-tl from-sky-50/60 to-blue-50/30 rounded-full blur-[130px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="mb-12 md:mb-16 md:w-1/2 text-center md:text-left">
        <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Core Values</motion.p>
        <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Filosofi & Nilai Profesional</motion.h2>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {values.map((val, idx) => (
          <motion.div key={idx} variants={fadeUp}
            whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="bg-white p-5 md:p-10 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-5 items-start hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-500 cursor-default">
            <div className="text-5xl md:text-6xl font-black text-slate-100 leading-none shrink-0">0{idx + 1}</div>
            <div>
              <h3 className="font-display text-lg md:text-xl font-black text-slate-800 mb-2">{val.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{val.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// === VISION & GOALS ===
const VisionGoals = () => (
  <section className="py-20 md:py-28 bg-white relative overflow-hidden">
    <div className="absolute top-[-5%] left-[40%] w-[500px] h-[400px] bg-gradient-to-br from-blue-50/60 to-violet-50/20 rounded-full blur-[130px] pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-6xl relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-6">
        <motion.div variants={fadeUp}
          whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 md:p-12 rounded-[2.5rem] border border-blue-100/50 hover:shadow-xl hover:shadow-blue-100/50 transition-shadow duration-500 cursor-default">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <FiEye size={20} />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Visi Kami</h3>
          </div>
          <p className="text-slate-600 text-base md:text-xl leading-relaxed font-medium">
            Menjadi platform teknologi andalan yang menghadirkan solusi digital modern untuk organisasi, bisnis, dan instansi yang membutuhkan sistem berbasis web yang efisien dan scalable.
          </p>
        </motion.div>

        <motion.div variants={fadeUp}
          whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 md:p-12 rounded-[2.5rem] border border-emerald-100/50 hover:shadow-xl hover:shadow-emerald-100/50 transition-shadow duration-500 cursor-default">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FiTarget size={20} />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Fokus Ke Depan</h3>
          </div>
          <ul className="space-y-3">
            {['Pengembangan sistem enterprise kompleks', 'Pembangunan platform digital berbasis big data', 'Pembuatan dashboard analitik instansi', 'Arsitektur server yang High Availability'].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 font-medium text-sm md:text-base">
                <FiCheck className="text-emerald-500 mt-0.5 shrink-0" /> {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// === CTA ===
const ModernAboutCTA = () => (
  <section className="py-24 md:py-36 bg-slate-50 relative overflow-hidden border-t border-slate-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-blue-100/60 to-purple-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
    <div className="container mx-auto px-5 md:px-8 max-w-4xl text-center relative z-10">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
          Mari Wujudkan <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ide Anda</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
          Jika Anda membutuhkan website profesional atau sistem informasi yang solid, kami siap membantu membangunnya dari nol.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-1 transition-all border border-slate-700 shadow-xl w-full sm:w-auto">
            Mulai Diskusi Proyek <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const About = () => (
  <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
    <AboutHero />
    <AboutMBNPTech />
    <FounderProfile />
    <SkillsTech />
    <ProfessionalValues />
    <VisionGoals />
    <ModernAboutCTA />
  </div>
);

export default About;