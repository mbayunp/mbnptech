// src/pages/public/Home.tsx
import { Link } from 'react-router-dom';

// --- SUB-COMPONENTS ---

const HeroSection = () => (
  <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-200">
          MBNP Tech
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
          Solusi Website & Sistem Informasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Modern</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kami membangun website profesional, portal data, dan sistem informasi berbasis web dengan teknologi modern untuk Bisnis, Organisasi, dan Instansi Pemerintah.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/projects" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
            Lihat Portfolio
          </Link>
          <Link to="/contact" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-blue-200 transition-all">
            Konsultasi Proyek
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-500">
          <span className="flex items-center gap-2"><span className="text-blue-500">✔</span> Government Website Development</span>
          <span className="flex items-center gap-2"><span className="text-blue-500">✔</span> Modern Web Application</span>
          <span className="flex items-center gap-2"><span className="text-blue-500">✔</span> Data Portal & Dashboard</span>
          <span className="flex items-center gap-2"><span className="text-blue-500">✔</span> Clean & Scalable System</span>
        </div>
      </div>
    </div>
    <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl -translate-x-1/2"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
  </section>
);

const ExperienceSection = () => {
  const stats = [
    { label: 'Projects Completed', value: '4+', color: 'text-blue-600' },
    { label: 'Technologies Used', value: 'React • Express • PHP • MySQL', color: 'text-slate-800', isText: true },
    { label: 'Domains', value: 'Government • Creative • Corporate', color: 'text-slate-800', isText: true },
  ];
  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Experience in Digital System Development</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-blue-200 transition-colors">
              <div className={`mb-2 font-black ${stat.isText ? 'text-lg md:text-xl' : 'text-4xl md:text-5xl'} ${stat.color}`}>{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
        <div className="w-full lg:w-1/2 relative">
          <div className="aspect-square md:aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200 shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-sky-50 opacity-50"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">💻</div>
              <div className="text-xl font-bold text-slate-800">MBNP Tech</div>
              <div className="text-sm font-medium text-blue-600">Digital Transformation</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[radial-gradient(#CBD5E1_2px,transparent_2px)] [background-size:8px_8px] rounded-full"></div>
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">About MBNP Tech</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
            Membangun Ekosistem Digital yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Scalable & Modern</span>
          </h3>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>MBNP Tech merupakan layanan pengembangan website dan sistem informasi yang berfokus pada pembuatan solusi digital modern untuk organisasi, bisnis, dan instansi pemerintahan.</p>
            <p>Dengan pendekatan teknologi modern seperti <strong>React, Express.js,</strong> dan sistem database yang terstruktur, kami membantu membangun sistem yang cepat, <em>scalable</em>, dan mudah digunakan.</p>
            <p>Kami tidak hanya membuat website, tetapi juga membangun portal data, sistem administrasi digital, dan aplikasi berbasis web untuk mendukung transformasi digital secara menyeluruh.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesSection = () => {
  const services = [
    { icon: "🌐", title: "Website Development", description: "Pembuatan website modern untuk organisasi dan bisnis.", features: ["Responsive Design", "Modern UI", "SEO Friendly", "Fast Performance"] },
    { icon: "⚙️", title: "Sistem Informasi", description: "Pengembangan sistem berbasis web untuk administrasi digital.", features: ["Sistem Manajemen Data", "Dashboard Monitoring", "Sistem Administrasi"] },
    { icon: "📊", title: "Portal Data & Dashboard", description: "Pengembangan portal data publik dan dashboard analitik.", features: ["Visualisasi Data", "Grafik Statistik", "Manajemen Dataset"] },
    { icon: "📱", title: "Web Application", description: "Pengembangan aplikasi berbasis web untuk kebutuhan operasional bisnis yang kompleks.", features: ["Custom Workflow", "API Integration", "Secure Architecture"] }
  ];
  return (
    <section id="services" className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">Solusi Teknologi Terintegrasi</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <span className="text-blue-500 text-xs">✔</span> {feature}
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

const FeaturedProject = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Featured Creative Project</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900">Picme Studio</h2>
      </div>
      <div className="bg-blue-500 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <p className="text-slate-200 text-lg leading-relaxed mb-6">Picme Studio adalah platform digital interaktif yang dirancang khusus untuk studio kreatif. Website ini tidak hanya berfungsi sebagai portfolio karya, tetapi juga sebagai hub interaksi dengan klien.</p>
            <p className="text-slate-200 leading-relaxed mb-8">Dibangun menggunakan arsitektur modern berbasis React dan Express.js, sistem ini menjamin performa render gambar yang sangat cepat dan pengalaman pengguna (UX) yang mulus.</p>
            <div className="space-y-3 mb-10">
              <div className="flex items-center gap-3 text-slate-300"><span className="w-6 h-6 rounded bg-white text-green-500 flex items-center justify-center text-xs">✓</span>Dynamic Portfolio Gallery</div>
              <div className="flex items-center gap-3 text-slate-300"><span className="w-6 h-6 rounded bg-white text-green-500 flex items-center justify-center text-xs">✓</span>Service & Pricing Showcase</div>
              <div className="flex items-center gap-3 text-slate-300"><span className="w-6 h-6 rounded bg-white text-green-500 flex items-center justify-center text-xs">✓</span>Fast Image Rendering</div>
              <div className="flex items-center gap-3 text-slate-300"><span className="w-6 h-6 rounded bg-white text-green-500 flex items-center justify-center text-xs">✓</span>Express.js Backend Integration</div>
            </div>
            <a href="https://picmestudio.id/" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
              Kunjungi Website →
            </a>
          </div>
        </div>

        {/* 📸 BAGIAN GAMBAR YANG DIPERBARUI */}
        <div className="w-full lg:w-1/2 bg-slate-900 p-6 md:p-10 flex items-center justify-center border-l border-slate-800">
          <div className="w-full aspect-[4/3] bg-[#0F172A] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col group">
            {/* Browser Header Mockup */}
            <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              <div className="ml-2 px-3 py-1 bg-slate-900/50 rounded-md">
                 <div className="w-24 h-1.5 bg-slate-700 rounded-full"></div>
              </div>
            </div>
            {/* Image Content */}
            <div className="flex-1 overflow-hidden relative bg-slate-900">
              <img 
                src="/p1.jpeg" 
                alt="Picme Studio Preview" 
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              {/* Overlay agar teks di atas gambar (jika ada) lebih terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProjectsSection = () => {
  const projects = [
    { title: "Portal Garut Satu Data", category: "Government", tech: ["React", "PHP"], description: "Portal data terpadu resmi Pemerintah Kabupaten Garut yang bertujuan untuk menyediakan akses data publik secara transparan dan terintegrasi. Dirancang dengan antarmuka modern dan responsif." },
    { title: "Picme Studio", category: "Creative Platform", tech: ["React", "Express.js"], description: "Platform digital untuk studio kreatif Picme Studio yang menampilkan layanan fotografi dan portfolio karya. Sistem dibangun menggunakan arsitektur modern untuk performa cepat." },
    { title: "IMN Business Group", category: "Corporate Profile", tech: ["React", "Express.js"], description: "Website profil perusahaan profesional untuk IMN Business Group yang dirancang untuk merepresentasikan kredibilitas bisnis secara modern dengan backend yang stabil." },
    { title: "Bidang Statistik Garut", category: "Internal Government", tech: ["Next.js", "Express.js", "MySQL"], description: "Website Internal Bidang Statistik Diskominfo Kabupaten Garut yang menyediakan identitas bidang dan serta dokumentasi kegiatan bidang statistik." }
  ];
  return (
    <section id="projects" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Project Showcase</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">Karya Terbaik Kami</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">{project.category}</span>
                <div className="flex gap-2">
                  {project.tech.map((t, i) => <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{t}</span>)}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{project.title}</h4>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{project.description}</p>
              <button className="self-start font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 group">
                Kunjungi Website <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStackSection = () => {
  const stacks = [
    { title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "JavaScript"] },
    { title: "Backend", items: ["Node.js", "Express.js", "PHP", "Laravel"] },
    { title: "Database", items: ["MySQL", "PostgreSQL", "Laragon", "MongoDB"] },
    { title: "Tools", items: ["Git", "Linux Server", "REST API", "Docker"] }
  ];
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Technology Stack</h2>
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-16">Teknologi Modern & Handal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stacks.map((category, index) => (
            <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-left">
              <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">{category.title}</h4>
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

const WorkflowSection = () => {
  const steps = [
    { num: "01", title: "Konsultasi", desc: "Diskusi mendalam mengenai kebutuhan sistem atau website Anda." },
    { num: "02", title: "Perencanaan", desc: "Perancangan arsitektur sistem, struktur database, dan desain UI/UX." },
    { num: "03", title: "Development", desc: "Tahap pengkodean menggunakan teknologi modern dan best practices." },
    { num: "04", title: "Deployment", desc: "Sistem di-deploy ke server, diuji, dan siap digunakan oleh publik." },
    { num: "05", title: "Maintenance", desc: "Support teknis berkala dan pengembangan fitur lanjutan." }
  ];
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-16 md:w-1/2">
          <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Cara Kerja Kami</h2>
          <h3 className="text-3xl md:text-4xl font-black text-white">Alur Kerja yang Sistematis & Transparan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-5xl font-black text-slate-800 mb-4">{step.num}</div>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              {index < steps.length - 1 && <div className="hidden md:block absolute top-6 left-12 w-full h-[1px] bg-slate-800"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
        Bangun Website atau Sistem <span className="text-blue-600">Digital Anda</span>
      </h2>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        MBNP Tech siap membantu mengembangkan website dan sistem informasi modern untuk bisnis, organisasi, dan instansi Anda.
      </p>
      <Link to="/contact" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 transition-all">
        Konsultasi Sekarang
      </Link>
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-400">
        <span className="flex items-center gap-2"><span className="text-green-500">✔</span> Modern Tech Stack</span>
        <span className="flex items-center gap-2"><span className="text-green-500">✔</span> Clean Code</span>
        <span className="flex items-center gap-2"><span className="text-green-500">✔</span> Scalable Architecture</span>
      </div>
    </div>
  </section>
);

// --- MAIN HOME COMPONENT ---

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ExperienceSection />
      <AboutSection />
      <ServicesSection />
      <FeaturedProject />
      <ProjectsSection />
      <TechStackSection />
      <WorkflowSection />
      <CTASection />
    </div>
  );
};

export default Home;