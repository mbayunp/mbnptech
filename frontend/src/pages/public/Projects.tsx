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
  FaLaptopCode
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const ProjectsHero = () => (
  <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200 text-center px-6">
    {/* Abstract Background */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-full blur-3xl"></div>
    
    <div className="container mx-auto max-w-4xl relative z-10">
      <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-200">
        Our Work
      </span>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
        Projects & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Portfolio</span>
      </h1>
      <h2 className="text-xl font-bold text-slate-700 mb-6 max-w-3xl mx-auto">
        Kumpulan proyek website dan sistem digital yang telah dikembangkan menggunakan teknologi modern dengan fokus pada performa, skalabilitas, dan pengalaman pengguna.
      </h2>
      <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Portfolio ini mencakup berbagai jenis sistem digital mulai dari portal data pemerintah, platform kreatif, website perusahaan, hingga sistem administrasi berbasis web yang mendukung operasional organisasi.
      </p>
      
      <a href="#portfolio" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
        Lihat Project ↓
      </a>
    </div>
  </section>
);

const ProjectsOverview = () => (
  <section className="py-20 bg-white px-6">
    <div className="container mx-auto max-w-4xl text-center">
      <h3 className="text-3xl font-black text-slate-900 mb-8">Sistem Digital Multi-Sektor</h3>
      <div className="text-lg text-slate-600 leading-relaxed space-y-6">
        <p>
          MBNP Tech telah mengembangkan berbagai proyek digital yang mencakup berbagai sektor seperti pemerintahan, perusahaan, dan industri kreatif.
        </p>
        <p>
          Setiap proyek dikembangkan dengan pendekatan teknologi modern yang menitikberatkan pada performa sistem, keamanan data, serta kemudahan dalam pengelolaan dan pengembangan lanjutan.
        </p>
        <p>
          Beberapa proyek yang telah dikembangkan meliputi portal data publik, platform digital kreatif, website perusahaan, serta sistem administrasi berbasis web.
        </p>
      </div>
    </div>
  </section>
);

const FeaturedProjects = () => {
  const projects = [
    {
      title: "Portal Garut Satu Data",
      category: "Government Portal",
      tech: ["React", "PHP"],
      desc: "Portal Garut Satu Data merupakan platform data terpadu resmi Pemerintah Kabupaten Garut yang bertujuan untuk menyediakan akses informasi data publik secara transparan dan terstruktur. Website ini dirancang untuk menampilkan berbagai dataset statistik, infografis, serta informasi publik yang dapat diakses oleh masyarakat.",
      features: [
        "Publikasi dataset statistik",
        "Manajemen infografis",
        "Sistem manajemen konten",
        "Dashboard administrasi data",
        "Tampilan modern dan responsif"
      ],
      link: "https://bidangstatistik.garutkab.go.id/",
      color: "blue",
      image: "/1.jpeg" // Gambar project ke-1
    },
    {
      title: "UKBI Garut 2026 Monitoring",
      category: "Government System",
      tech: ["React", "Node.js", "Express.js", "MySQL"],
      desc: "Website UKBI Garut 2026 merupakan sistem digital yang digunakan untuk memantau kuota pendaftar Uji Kemahiran Berbahasa Indonesia (UKBI) di Kabupaten Garut. Platform ini dirancang untuk membantu pengelolaan proses pendaftaran serta verifikasi berkas peserta secara digital melalui dashboard administrasi.",
      features: [
        "Monitoring kuota peserta UKBI",
        "Sistem verifikasi berkas pendaftar",
        "Dashboard admin untuk validasi peserta",
        "Status kelulusan atau penolakan peserta",
        "Halaman profil peserta dengan hasil verifikasi"
      ],
      link: "https://ukbigarut2026.garutkab.go.id",
      color: "emerald",
      image: "/2.jpeg" // Gambar project ke-2
    },
    {
      title: "Picme Studio",
      category: "Creative Platform",
      tech: ["React", "Express.js"],
      desc: "Picme Studio merupakan platform digital untuk studio kreatif yang menampilkan portfolio karya serta layanan kreatif yang ditawarkan oleh studio tersebut. Website ini dikembangkan menggunakan arsitektur modern berbasis React dan Express untuk memberikan performa yang cepat serta pengalaman pengguna yang dinamis.",
      features: [
        "Portfolio karya digital",
        "Halaman layanan studio",
        "Sistem manajemen konten",
        "Tampilan modern dan responsif"
      ],
      link: "https://picmestudio.id/",
      color: "fuchsia",
      image: "/3.jpeg" // Gambar project ke-3
    },
    {
      title: "IMN Business Group",
      category: "Corporate Website",
      tech: ["React", "Express.js"],
      desc: "IMN Business Group merupakan website profil perusahaan yang dirancang untuk menampilkan identitas perusahaan secara profesional. Website ini berfungsi sebagai media informasi perusahaan serta meningkatkan kredibilitas bisnis melalui tampilan modern dan struktur konten yang profesional.",
      features: [
        "Profil perusahaan",
        "Informasi layanan bisnis",
        "Halaman kontak perusahaan",
        "Desain profesional dan responsif"
      ],
      link: "https://imnbusinessgroup.co.id/",
      color: "indigo",
      image: "/4.jpeg" // Gambar project ke-4
    }
  ];

  return (
    <section id="portfolio" className="py-24 bg-slate-50 border-t border-slate-200 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Featured Projects</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900">Karya & Portfolio</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col group">
              
              {/* 📸 Tampilan Gambar Project Asli */}
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img 
                  src={project.image} 
                  alt={`Tangkapan layar ${project.title}`} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
                {/* Efek overlay warna transparan saat di-hover */}
                <div className={`absolute inset-0 bg-${project.color}-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>

              {/* Card Content */}
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                  <span className={`px-4 py-1.5 bg-${project.color}-50 text-${project.color}-700 text-xs font-bold uppercase tracking-wider rounded-full border border-${project.color}-100`}>
                    {project.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h4>
                
                <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base">
                  {project.desc}
                </p>

                <div className="mb-8 flex-grow">
                  <strong className="text-xs text-slate-900 uppercase tracking-wider block mb-3">Fitur Utama:</strong>
                  <ul className="space-y-2">
                    {project.features.map((feat, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <FaCheckCircle className={`text-${project.color}-500 mt-1 shrink-0`} /> 
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  Kunjungi Website <FaExternalLinkAlt className="text-sm" />
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
    { icon: <FaCode />, title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "JavaScript"] },
    { icon: <FaServer />, title: "Backend", items: ["Node.js", "Express.js", "PHP", "Laravel"] },
    { icon: <FaDatabase />, title: "Database", items: ["MySQL", "PostgreSQL"] },
    { icon: <FaRocket />, title: "Deployment", items: ["Linux Server", "Nginx", "Cloud Hosting"] }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Tech Stack</h2>
        <h3 className="text-3xl font-black text-slate-900 mb-16">Technology Used in Projects</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stacks.map((category, index) => (
            <div key={index} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 text-xl mb-6">
                {category.icon}
              </div>
              <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-3">{category.title}</h4>
              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 font-medium text-sm">
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
    { icon: <FaChartLine />, text: "Meningkatkan transparansi data publik bagi masyarakat." },
    { icon: <FaLaptopCode />, text: "Mempermudah pengelolaan administrasi secara digital." },
    { icon: <FaShieldAlt />, text: "Meningkatkan profesionalitas organisasi melalui website modern." },
    { icon: <FaUsers />, text: "Mempermudah akses informasi yang cepat dan akurat bagi pengguna." }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white px-6">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Value & Outcome</h2>
          <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Impact of the Developed Systems</h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Sistem digital yang dikembangkan bertujuan untuk meningkatkan efisiensi operasional, mempermudah pengelolaan data, serta menyediakan akses informasi yang lebih baik bagi pengguna akhir.
          </p>
        </div>
        
        <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
          {impacts.map((impact, idx) => (
            <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0 text-xl">
                {impact.icon}
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">{impact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DevelopmentApproach = () => {
  const steps = [
    "Analisis kebutuhan sistem",
    "Perancangan struktur sistem dan database",
    "Pengembangan frontend dan backend",
    "Pengujian sistem (Testing)",
    "Deployment ke server produksi",
    "Maintenance dan pengembangan lanjutan"
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Workflow</h2>
        <h3 className="text-3xl font-black text-slate-900 mb-6">Development Approach</h3>
        <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
          Setiap proyek dikembangkan melalui beberapa tahapan pengembangan yang terstruktur untuk memastikan setiap sistem memiliki kualitas teknis yang baik serta stabil dalam penggunaan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4 items-start">
              <div className="text-2xl font-black text-slate-300">0{idx + 1}</div>
              <div className="text-slate-700 font-bold mt-1">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsCTA = () => (
  <section className="py-24 bg-blue-600 text-center px-6">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
        Interested in Building a Digital System?
      </h2>
      <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
        Jika Anda membutuhkan website profesional atau sistem berbasis web untuk organisasi maupun bisnis, MBNP Tech siap membantu mengembangkan solusi digital yang sesuai dengan kebutuhan Anda.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/contact" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-black text-lg hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all">
          Diskusi Proyek
        </Link>
        <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-700 text-white rounded-xl font-black text-lg hover:bg-blue-800 transition-all">
          Hubungi Saya
        </a>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const Projects = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
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