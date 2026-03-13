// src/pages/public/Projects.tsx
import { Link } from 'react-router-dom';
import {
  FaExternalLinkAlt,
  FaCheckCircle,
  FaCode,
  FaServer,
  FaDatabase,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaLaptopCode,
  FaArrowRight
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const ProjectsHero = () => (
  <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pb-12 md:pb-20 overflow-hidden bg-[#fafafa]">
    {/* Modern Animated Gradient Background blobs */}
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-[0%] left-[50%] -translate-x-1/2 w-[80%] md:w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[80%] md:w-[50%] h-[40%] bg-indigo-400/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply"></div>
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
          <span className="text-xs md:text-sm font-bold text-slate-800 tracking-wide uppercase">Our Best Work</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black text-slate-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
          Projects & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
            Portfolio
          </span>
        </h1>

        <p className="text-base md:text-2xl text-slate-600 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2">
          Kumpulan ekosistem digital, portal data, dan sistem web enterprise yang dirancang dengan performa, keamanan, dan skalabilitas tinggi.
        </p>

        <a href="#portfolio" className="group inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black text-base md:text-lg hover:bg-black hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all w-full sm:w-auto border border-slate-700">
          Eksplorasi Karya
          <FaArrowRight className="group-hover:translate-x-1 transition-transform rotate-90 group-hover:rotate-90" />
        </a>
      </div>
    </div>
  </section>
);

const ProjectsOverview = () => (
  <section className="py-16 md:py-24 bg-white relative z-20 -mt-6 md:-mt-10 rounded-t-[2rem] md:rounded-t-[3rem] border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
    <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
      <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Multi-Sektor</h2>
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 md:mb-8">Solusi Digital Berbagai Industri</h3>
      <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium px-4">
        Dari portal publik pemerintahan yang membutuhkan transparansi tingkat tinggi, platform kreatif yang mengedepankan estetika, hingga sistem korporasi untuk efisiensi operasional. Setiap karya dibangun dengan pondasi arsitektur terbaik.
      </p>
    </div>
  </section>
);

const FeaturedProjects = () => {
  const projects = [
    {
      title: "Portal Garut Satu Data",
      category: "Government Portal",
      tech: ["React", "PHP API", "Tailwind"],
      desc: "Platform data terpadu resmi Pemerintah Kabupaten Garut. Menyediakan akses informasi data publik secara transparan, terstruktur, lengkap dengan visualisasi statistik dan infografis untuk masyarakat luas.",
      features: ["Publikasi dataset statistik", "Manajemen infografis", "Dashboard administrasi data"],
      link: "https://bidangstatistik.garutkab.go.id/",
      color: "blue",
      image: "/1.jpeg"
    },
    {
      title: "UKBI Garut 2026 Monitoring",
      category: "Government System",
      tech: ["React", "Node.js", "Express.js", "MySQL"],
      desc: "Sistem digital pemantauan kuota dan verifikasi pendaftar Uji Kemahiran Berbahasa Indonesia (UKBI). Dilengkapi dashboard admin real-time untuk memvalidasi berkas ribuan peserta secara efisien.",
      features: ["Monitoring kuota peserta", "Verifikasi berkas digital", "Status kelulusan real-time"],
      link: "https://ukbigarut2026.garutkab.go.id",
      color: "emerald",
      image: "/2.jpeg"
    },
    {
      title: "Picme Studio",
      category: "Creative Platform",
      tech: ["React", "Express.js", "Dynamic Render"],
      desc: "Platform portfolio interaktif untuk studio kreatif profesional. Mengedepankan performa render gambar yang cepat (lazy-loading) dan animasi dinamis untuk memukau calon klien fotografi.",
      features: ["Portfolio karya dinamis", "Katalog layanan premium", "CMS Kustom untuk Studio"],
      link: "https://picmestudio.id/",
      color: "fuchsia",
      image: "/3.jpeg"
    },
    {
      title: "IMN Business Group",
      category: "Corporate Website",
      tech: ["React", "Express.js", "SEO Optimized"],
      desc: "Website profil perusahaan B2B berskala nasional. Dirancang untuk menonjolkan kredibilitas perusahaan, layanan inti, dan mempermudah akuisisi klien (lead generation) melalui struktur UI yang elegan.",
      features: ["Profil perusahaan B2B", "Integrasi kontak langsung", "Desain eksklusif & responsif"],
      link: "https://imnbusinessgroup.co.id/",
      color: "indigo",
      image: "/4.jpeg"
    }
  ];

  return (
    <section id="portfolio" className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Portfolio</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Showcase Karya Terbaik</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col group">

              {/* 📸 Image Container */}
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img
                  src={project.image}
                  alt={`Tangkapan layar ${project.title}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className={`absolute inset-0 bg-${project.color}-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
              </div>

              {/* Card Content */}
              <div className="p-6 md:p-10 flex flex-col flex-grow relative">
                {/* Decorative glow inside card */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${project.color}-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`}></div>

                <div className="flex flex-wrap justify-between items-start mb-6 gap-3">
                  <span className={`px-3 py-1.5 bg-${project.color}-50 text-${project.color}-700 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg border border-${project.color}-100`}>
                    {project.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className={`text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-${project.color}-600 transition-colors tracking-tight`}>
                  {project.title}
                </h4>

                <p className="text-slate-500 leading-relaxed mb-8 text-sm md:text-base font-medium">
                  {project.desc}
                </p>

                <div className="mb-8 flex-grow">
                  <strong className="text-[10px] text-slate-400 uppercase tracking-widest block mb-3">Highlight Fitur:</strong>
                  <ul className="space-y-2.5">
                    {project.features.map((feat, i) => (
                      <li key={i} className="text-sm text-slate-700 font-semibold flex items-start gap-3">
                        <FaCheckCircle className={`text-${project.color}-500 mt-0.5 shrink-0 text-sm`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-${project.color}-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-${project.color}-500/30`}
                >
                  Kunjungi Website <FaExternalLinkAlt className="text-xs ml-1 opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechHighlight = () => {
  const stacks = [
    { icon: <FaCode />, title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "TypeScript"] },
    { icon: <FaServer />, title: "Backend", items: ["Node.js", "Express.js", "PHP", "Laravel API"] },
    { icon: <FaDatabase />, title: "Database", items: ["MySQL", "PostgreSQL", "Redis"] },
    { icon: <FaRocket />, title: "Deployment", items: ["Linux VPS", "Nginx", "Docker", "CI/CD"] }
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Tech Stack</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Teknologi Dibalik Layar</h3>
        </div>

        {/* Bento Grid Tech */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stacks.map((category, index) => (
            <div key={index} className="p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-left hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 text-xl md:text-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {category.icon}
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-900 mb-4">{category.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 font-medium text-xs md:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{item}
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

const ProjectImpact = () => {
  const impacts = [
    { icon: <FaChartLine />, title: "Transparansi Data", text: "Meningkatkan aksesibilitas data publik bagi masyarakat dan stakeholder." },
    { icon: <FaLaptopCode />, title: "Otomatisasi Sistem", text: "Memangkas waktu birokrasi dan administrasi manual secara signifikan." },
    { icon: <FaShieldAlt />, title: "Kredibilitas Digital", text: "Mengangkat citra profesional organisasi melalui UI/UX berstandar global." },
    { icon: <FaUsers />, title: "User Experience", text: "Menjamin kemudahan navigasi bagi end-user dari segala kalangan usia." }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#0F172A] text-white px-4 md:px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-10 md:gap-16 items-center relative z-10">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-xs md:text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Value & Outcome</h2>
          <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Dampak Nyata dari Setiap Baris Kode</h3>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
            Kami tidak sekadar menulis kode. Kami membangun sistem digital yang dirancang untuk memecahkan masalah nyata, meningkatkan efisiensi operasional, dan memperkuat posisi brand Anda di era digital.
          </p>
        </div>

        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {impacts.map((impact, idx) => (
            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-[1.5rem] border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-4 text-lg">
                {impact.icon}
              </div>
              <h4 className="font-bold text-white mb-2">{impact.title}</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{impact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DevelopmentApproach = () => {
  const steps = [
    { title: "Requirement Analysis", desc: "Membedah kebutuhan fundamental." },
    { title: "System Architecture", desc: "Perancangan skema & database." },
    { title: "Modern Development", desc: "Penulisan clean code & UI/UX." },
    { title: "Testing & QA", desc: "Uji performa dan keamanan." },
    { title: "Live Deployment", desc: "Rilis ke production server." },
    { title: "Maintenance", desc: "Dukungan teknis jangka panjang." }
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Workflow</h2>
        <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Proses Development</h3>
        <p className="text-base md:text-lg text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
          Standard Operating Procedure (SOP) yang ketat memastikan setiap proyek dirilis tepat waktu dengan kualitas teknis tanpa kompromi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col hover:border-blue-200 transition-colors group">
              <div className="text-4xl md:text-5xl font-black text-slate-200 mb-4 group-hover:text-blue-100 transition-colors">0{idx + 1}</div>
              <h4 className="text-lg font-black text-slate-800 mb-2">{step.title}</h4>
              <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsCTA = () => (
  <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden border-t border-slate-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-indigo-100/50 to-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
        Siap Membangun <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Proyek Anda?</span>
      </h2>
      <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto font-medium px-4">
        Jangan biarkan ide hebat Anda hanya sebatas rencana. Mari wujudkan menjadi ekosistem digital yang nyata bersama kami.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all group w-full sm:w-auto">
          Mulai Diskusi
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 w-full sm:w-auto shadow-sm">
          WhatsApp Saya
        </a>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const Projects = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      <ProjectsHero />
      <ProjectsOverview />
      <FeaturedProjects />
      <TechHighlight />
      <ProjectImpact />
      <DevelopmentApproach />
      <ProjectsCTA />
    </div>
  );
};

export default Projects;