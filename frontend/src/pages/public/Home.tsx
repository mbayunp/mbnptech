import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center pb-12 md:pb-20 overflow-hidden bg-[#fafafa]">
    {/* Modern Animated Gradient Background blobs */}
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[60%] md:w-[40%] h-[50%] bg-indigo-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply border border-indigo-200"></div>
      <div className="absolute bottom-[-10%] left-[10%] md:left-[20%] w-[80%] md:w-[60%] h-[40%] bg-emerald-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>

    <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20 md:pt-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-sm mb-8 md:mb-10 hover:bg-white hover:scale-105 transition-all cursor-pointer">
          <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-blue-600"></span>
          </span>
          <span className="text-xs md:text-sm font-bold text-slate-800 tracking-wide uppercase">MBNP Tech • IT Solutions</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]">
          Membangun Ekosistem <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
            Digital Terskalabel
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2">
          Mentransformasi ide kompleks menjadi sistem informasi modern, super cepat, dan impact-driven untuk Bisnis & Pemerintahan.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center px-4">
          <Link to="/contact" className="group relative w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/30 flex justify-center items-center gap-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10">Mulai Kolaborasi</span>
            <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link to="/projects" className="w-full sm:w-auto px-8 py-4 bg-white/60 backdrop-blur-sm text-slate-800 border border-slate-200/80 rounded-2xl font-bold text-base md:text-lg hover:bg-white hover:border-slate-300 transition-all hover:scale-105 shadow-sm flex justify-center items-center">
            Lihat Portfolio
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesBentoSection = () => (
  <section className="py-16 md:py-24 bg-white relative z-20 -mt-6 md:-mt-10 rounded-t-[2rem] md:rounded-t-[3rem] border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
    <div className="container mx-auto px-4 md:px-6 max-w-6xl">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Layanan Unggulan</h2>
        <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 md:mb-6">Expertise Teknologi Modern</h3>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto px-4">Solusi komprehensif dari perancangan arsitektur hingga deployment produksi, didesain untuk performa maksimal.</p>
      </div>

      {/* Modern Bento Grid - Changed auto-rows for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[280px]">
        {/* Main Feature */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-[#0B1120] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/40 transition-all duration-500 border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[200px] md:min-h-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-white/10 ring-1 ring-white/5 mb-6 md:mb-0">💻</div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">Enterprise Web Apps</h4>
              <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-md">Pengembangan sistem web kompleks (React, Express) yang scalable, terstruktur, dan siap untuk enterprise.</p>
            </div>
          </div>
        </div>

        {/* Small Feature 1 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-blue-100/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 group min-h-[200px] md:min-h-0">
          <div className="h-full flex flex-col justify-between">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform mb-6 md:mb-0">📊</div>
            <div>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Portal Data</h4>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">Dashboard & open data portal untuk Pemerintah.</p>
            </div>
          </div>
        </div>

        {/* Small Feature 2 */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-emerald-100/50 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 group min-h-[200px] md:min-h-0">
          <div className="h-full flex flex-col justify-between">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform mb-6 md:mb-0">⚡</div>
            <div>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Modern UI/UX</h4>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">Eksplorasi antarmuka estetik yang interaktif.</p>
            </div>
          </div>
        </div>

        {/* Wide Informational Feature */}
        <div className="md:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden group min-h-[220px] md:min-h-0">
          <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] md:[mask-image:linear-gradient(to_left,white,transparent)] pointer-events-none"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider w-max border border-slate-200 mb-6 md:mb-0">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Performance First
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Sistem Pemerintahan (SPBE) & Corporate</h4>
              <p className="text-slate-600 text-sm md:text-lg lg:text-xl max-w-xl leading-relaxed">
                Penerapan <em>clean code rules</em> menjamin sistem yang cepat, aman, dan mudah di-maintain. Spesialisasi kami ada pada transformasi digital instansi publik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedProjectSection = () => (
  <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <div className="mb-10 md:mb-16 md:flex md:items-end md:justify-between text-center md:text-left">
        <div className="max-w-2xl mx-auto md:mx-0">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Showcase Utama</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Karya Terbaik Tersorot</h3>
        </div>
        <div className="mt-6 md:mt-0 hidden md:block">
          <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
            Semua Portfolio <span className="text-blue-600">→</span>
          </Link>
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 flex flex-col lg:flex-row gap-8 md:gap-12 items-center relative overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="w-full lg:w-[45%] relative z-10 text-center lg:text-left pt-4 lg:pt-0">
          <div className="inline-block px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6">
            Creative Portfolio Studio
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">Picme Studio</h3>
          <p className="text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
            Platform portfolio interaktif dengan performa render dinamis yang dirancang khusus untuk menampilkan layanan fotografi studio kreatif secara elegan.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mb-8 md:mb-10">
            {['React', 'Express.js', 'Tailwind', 'Dynamic Gallery'].map((tech, i) => (
              <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-xs md:text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
          <a href="https://picmestudio.id/" target="_blank" rel="noopener noreferrer" className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30">
            Kunjungi Website
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <span className="text-xs md:text-sm">↗</span>
            </div>
          </a>
        </div>

        {/* Browser Mockup */}
        <div className="w-full lg:w-[55%] relative z-10">
          <div className="rounded-xl md:rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 shadow-2xl overflow-hidden transform transition-transform hover:-translate-y-2 hover:scale-[1.02] duration-500 group">
            <div className="h-8 md:h-10 bg-slate-900 border-b border-slate-700/80 flex items-center px-3 md:px-4 gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27C93F]"></div>
              <div className="ml-2 md:ml-4 flex-1 flex justify-center">
                <div className="w-2/3 md:w-1/2 h-4 md:h-5 bg-slate-800 rounded-md border border-slate-700 text-[8px] md:text-[10px] text-slate-500 flex items-center justify-center tracking-widest font-mono">picmestudio.id</div>
              </div>
            </div>
            <div className="relative overflow-hidden aspect-[4/3] bg-slate-900">
              <img src="/p1.jpeg" alt="Picme Preview" className="w-full h-full object-cover object-top border-none group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile only "See All" button */}
      <div className="mt-8 text-center md:hidden">
        <Link to="/projects" className="inline-flex w-full justify-center items-center gap-2 px-6 py-4 bg-white text-slate-800 font-bold border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm">
          Semua Portfolio <span className="text-blue-600">→</span>
        </Link>
      </div>
    </div>
  </section>
);

const OtherProjectsSection = () => {
  const projects = [
    { title: "Portal Garut Satu Data", category: "Government", tech: ["React", "PHP API"] },
    { title: "IMN Business Group", category: "Corporate", tech: ["React", "Express.js"] },
    { title: "Statistik Diskominfo", category: "Internal App", tech: ["Next.js", "MySQL"] }
  ];
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-8 md:mb-10 text-center">Lebih Banyak Projek</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((p, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 hover:shadow-xl hover:shadow-slate-200 hover:-translate-y-1 transition-all">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-lg mb-3 md:mb-4">{p.category}</span>
              <h4 className="text-lg md:text-xl font-black text-slate-800 mb-3 md:mb-4">{p.title}</h4>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t, idx) => <span key={idx} className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FlowSection = () => (
  <section className="py-16 md:py-24 bg-[#0F172A] text-white overflow-hidden relative border-t border-slate-800">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
    <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
      <div className="mb-12 md:mb-16 md:w-1/2 text-center md:text-left">
        <h2 className="text-xs md:text-sm font-bold text-sky-400 uppercase tracking-widest mb-3 md:mb-4">Eksekusi Tanpa Kompromi</h2>
        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">Alur Kerja Sistematis</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
        {[
          { n: "01", t: "Diskusi & Riset", d: "Memahami visi dan kebutuhan kompleks sistem Anda." },
          { n: "02", t: "Arsitektur", d: "Merancang fondasi UI/UX dan struktur database yang kokoh." },
          { n: "03", t: "Development", d: "Membangun dengan teknologi terbaru dan clean code." },
          { n: "04", t: "Deploy & Scale", d: "Uji coba menyeluruh dan perilisan ke production." }
        ].map((s, idx) => (
          <div key={idx} className="relative group text-center md:text-left border-b md:border-none border-slate-800 pb-6 md:pb-0 last:border-none">
            <div className="text-5xl md:text-6xl font-black text-slate-800/80 mb-3 md:mb-4 group-hover:text-blue-500/20 transition-colors">{s.n}</div>
            <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{s.t}</h4>
            <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-xs mx-auto md:mx-0">{s.d}</p>
            {idx < 3 && <div className="hidden md:block absolute top-10 left-16 right-4 h-[1px] bg-gradient-to-r from-slate-700 to-transparent"></div>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ModernCTAButton = () => (
  <section className="py-20 md:py-32 bg-white relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -z-10"></div>
    <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
        Siap Kolaborasi <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Level Selanjutnya?</span>
      </h2>
      <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto font-medium px-4">
        Jadwalkan diskusi santai tentang visi digital Anda dan mari buat eksekusi yang nyata.
      </p>
      <Link to="/contact" className="inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all group border border-slate-700 shadow-xl w-full sm:w-auto">
        Konsultasi Sekarang
        <span className="group-hover:translate-x-1 transition-transform">🚀</span>
      </Link>
    </div>
  </section>
);

// --- MAIN HOME COMPONENT ---
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      <HeroSection />
      <FeaturesBentoSection />
      <FeaturedProjectSection />
      <OtherProjectsSection />
      <FlowSection />
      <ModernCTAButton />
    </div>
  );
};

export default Home;