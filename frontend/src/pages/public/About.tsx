// src/pages/public/About.tsx
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaServer,
  FaDatabase,
  FaTools,
  FaCheckCircle,
  FaQuoteLeft,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
  FaArrowRight
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const AboutHero = () => (
  <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pb-12 md:pb-20 overflow-hidden bg-[#fafafa]">
    {/* Modern Animated Gradient Background blobs */}
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[10%] md:left-[20%] w-[80%] md:w-[60%] h-[40%] bg-indigo-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>

    <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-32 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm mb-6 md:mb-8">
          <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-blue-600"></span>
          </span>
          <span className="text-xs md:text-sm font-bold text-slate-800 tracking-wide uppercase">Kisah Kami</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black text-slate-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
          Tentang <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            MBNP Tech
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2">
          Berfokus pada pengembangan sistem informasi berbasis web dan platform digital untuk membangun solusi teknologi yang efektif, modern, dan terskalabel.
        </p>
      </div>
    </div>
  </section>
);

const AboutMBNPTech = () => (
  <section className="py-16 md:py-24 bg-white relative z-20 -mt-6 md:-mt-10 rounded-t-[2rem] md:rounded-t-[3rem] border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
    <div className="container mx-auto px-4 md:px-6 max-w-6xl">
      <div className="bg-slate-50 border border-slate-100 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] md:[mask-image:linear-gradient(to_left,white,transparent)] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center relative z-10">
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-white p-4 rounded-[1.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 mb-6 group-hover:scale-105 transition-transform duration-500">
              <img src="/logo.png" alt="MBNP Tech Logo" className="h-16 md:h-20 w-auto object-contain" />
            </div>
            <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Platform Overview</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">What is MBNP Tech?</h3>
          </div>

          <div className="w-full md:w-2/3 space-y-4 md:space-y-6 text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            <p>
              MBNP Tech adalah platform pengembangan teknologi yang berfokus pada pembangunan website modern dan aplikasi berbasis web dengan pendekatan teknologi yang efisien dan scalable.
            </p>
            <p>
              Dikembangkan sebagai wadah untuk membangun solusi digital seperti website organisasi, portal data, sistem informasi, dan aplikasi berbasis web yang mendukung transformasi digital di berbagai sektor.
            </p>
            <p>
              Pendekatan kami menitikberatkan pada penggunaan teknologi modern, arsitektur sistem yang rapi, serta desain antarmuka yang responsif untuk pengalaman pengguna yang optimal.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FounderProfile = () => (
  <section className="py-16 md:py-24 bg-[#0F172A] text-white relative overflow-hidden">
    {/* Glow Effects */}
    <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

    <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-10 md:gap-16">

      {/* Visual Profil Placeholder (Bento Style) */}
      <div className="w-full lg:w-1/3">
        <div className="aspect-[4/5] bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/80 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/20 rounded-full flex items-center justify-center text-5xl md:text-6xl mb-6 border border-slate-600 group-hover:border-blue-400 group-hover:scale-105 transition-all shadow-inner">
            👨‍💻
          </div>
          <h4 className="text-2xl md:text-3xl font-black mb-2 relative z-10 tracking-tight">M. Bayu N.P.</h4>
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4 relative z-10">
            FullStack Developer
          </div>
          <p className="text-slate-400 text-xs md:text-sm font-medium flex items-center gap-2 relative z-10">
            <span>📍</span> Bandung — Cianjur — Garut
          </p>
        </div>
      </div>

      {/* Deskripsi Profil */}
      <div className="w-full lg:w-2/3 text-center md:text-left">
        <h2 className="text-xs md:text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Sang Pendiri</h2>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 tracking-tight">Muhammad Bayu Nurdiansyah Putra</h3>

        <div className="space-y-4 text-slate-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10 font-medium">
          <p>
            Berpengalaman dalam pengembangan sistem digital berbasis web selama lebih dari dua tahun. Lulusan Teknik Informatika dari UIN Bandung yang memiliki minat mendalam dalam modern web development.
          </p>
          <p>
            Bayu berfokus pada pembangunan sistem informasi yang tidak hanya memiliki tampilan visual menarik, tetapi juga struktur arsitektur yang rapi, clean code, dan mudah dikembangkan untuk jangka panjang.
          </p>
        </div>

        {/* Info Kontak (Pill Buttons) */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
          <a href="mailto:muhammadbayunp@gmail.com" className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-5 md:px-6 py-3 rounded-full transition-colors font-medium text-xs md:text-sm">
            <FaEnvelope className="text-sky-400 text-base md:text-lg" /> Email
          </a>
          <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-5 md:px-6 py-3 rounded-full transition-colors font-medium text-xs md:text-sm">
            <FaWhatsapp className="text-green-400 text-base md:text-lg" /> WhatsApp
          </a>
          <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-5 md:px-6 py-3 rounded-full transition-colors font-medium text-xs md:text-sm">
            <FaLinkedin className="text-blue-400 text-base md:text-lg" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>
);

const SkillsTech = () => {
  const stacks = [
    { icon: <FaCode />, title: "Frontend", items: ["React", "Next.js", "JavaScript", "Tailwind CSS"] },
    { icon: <FaServer />, title: "Backend", items: ["Node.js", "Express.js", "PHP", "Laravel"] },
    { icon: <FaDatabase />, title: "Database", items: ["MySQL", "PostgreSQL", "NoSQL Concepts"] },
    { icon: <FaTools />, title: "Deployment", items: ["Git", "Linux Server", "Nginx", "Cloud VPS"] }
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Technology Stack</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">Alat Kerja Kami</h3>
          <p className="text-base md:text-xl text-slate-500 font-medium px-4">
            Menggunakan ekosistem teknologi modern untuk menjamin kecepatan, keamanan, dan skalabilitas sistem.
          </p>
        </div>

        {/* Bento Grid for Tech Stacks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stacks.map((stack, idx) => (
            <div key={idx} className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-slate-200 text-blue-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {stack.icon}
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-900 mb-4">{stack.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {stack.items.map((item, i) => (
                  <li key={i} className="text-slate-600 font-medium text-xs md:text-sm flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500 text-[10px] md:text-xs" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProfessionalValues = () => {
  const values = [
    { title: "Quality First", desc: "Sistem dikembangkan dengan standar kualitas tinggi agar berjalan stabil." },
    { title: "Simplicity", desc: "Solusi yang sederhana, bersih, namun sangat efektif menyelesaikan masalah." },
    { title: "Scalability", desc: "Arsitektur dirancang agar siap berkembang seiring bertumbuhnya bisnis." },
    { title: "Continuous Learning", desc: "Adaptasi konstan terhadap teknologi terbaru untuk hasil maksimal." }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#fafafa] px-4 md:px-6 border-t border-slate-100">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 md:mb-16 md:w-1/2 text-center md:text-left">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Core Values</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Filosofi & Nilai Profesional</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 items-start hover:border-blue-200 transition-colors group">
              <div className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-blue-100 transition-colors leading-none">0{idx + 1}</div>
              <div>
                <h4 className="text-lg md:text-2xl font-black text-slate-800 mb-2">{val.title}</h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VisionGoals = () => (
  <section className="py-16 md:py-24 bg-white px-4 md:px-6">
    <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

      {/* Vision (Bento Box) */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-blue-100/50">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-blue-600/30">👁️</div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Visi Kami</h3>
        </div>
        <p className="text-slate-600 text-base md:text-xl leading-relaxed font-medium">
          Menjadi platform teknologi andalan yang menghadirkan solusi digital modern untuk organisasi, bisnis, dan instansi yang membutuhkan sistem berbasis web yang efisien dan scalable.
        </p>
      </div>

      {/* Future Goals (Bento Box) */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-emerald-100/50">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-emerald-500/30">🚀</div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Fokus Ke Depan</h3>
        </div>
        <ul className="space-y-3 md:space-y-4">
          {[
            "Pengembangan sistem enterprise kompleks",
            "Pembangunan platform digital berbasis big data",
            "Pembuatan dashboard analitik instansi",
            "Arsitektur server yang High Availability"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 font-medium text-sm md:text-lg">
              <span className="text-emerald-500 mt-1"><FaCheckCircle /></span> {item}
            </li>
          ))}
        </ul>
      </div>

    </div>
  </section>
);

const ModernAboutCTA = () => (
  <section className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
        Mari Wujudkan <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ide Anda</span>
      </h2>
      <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto font-medium px-4">
        Jika Anda membutuhkan website profesional atau sistem informasi yang solid, kami siap membantu membangunnya dari nol.
      </p>
      <Link to="/contact" className="inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all group border border-slate-700 shadow-xl w-full sm:w-auto">
        Mulai Diskusi Proyek
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const About = () => {
  return (
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
};

export default About;