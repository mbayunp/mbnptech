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
  FaWhatsapp
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const AboutHero = () => (
  <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50 text-center px-6 border-b border-slate-200">
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
    
    <div className="container mx-auto max-w-4xl relative z-10">
        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-100">
            This Us
          </span>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
        About <span className="text-blue-600">MBNP Tech</span>
      </h1>
      <p className="text-xl md:text-2xl font-bold text-slate-700 mb-6 leading-relaxed">
        Platform pengembangan website dan sistem digital yang didirikan oleh Muhammad Bayu Nurdiansyah Putra.
      </p>
      <p className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
        Berfokus pada pengembangan website profesional, sistem informasi berbasis web, dan platform digital yang membantu organisasi maupun bisnis dalam membangun solusi teknologi yang efektif, modern, dan scalable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
          Hubungi Saya
        </Link>
        <Link to="/services" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
          Lihat Services
        </Link>
      </div>
    </div>
  </section>
);

const AboutMBNPTech = () => (
  <section className="py-24 bg-white px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Kolom Kiri: Logo dan Judul */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Logo Terintegrasi dari folder public */}
          <img 
            src="/logo.png" 
            alt="MBNP Tech Logo" 
            className="h-24 w-auto object-contain mb-8 p-3 bg-white shadow-xl shadow-slate-100 rounded-3xl border border-slate-100" 
          />
          
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Platform Overview</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">What is MBNP Tech</h3>
        </div>
        
        {/* Kolom Kanan: Deskripsi */}
        <div className="w-full md:w-2/3 space-y-4 text-slate-600 text-lg leading-relaxed">
          <p>
            MBNP Tech adalah platform pengembangan teknologi yang berfokus pada pembangunan website modern dan aplikasi berbasis web dengan pendekatan teknologi yang efisien dan scalable.
          </p>
          <p>
            MBNP Tech dikembangkan sebagai wadah untuk membangun berbagai solusi digital seperti website organisasi, portal data, sistem informasi, dan aplikasi berbasis web yang mendukung transformasi digital di berbagai sektor.
          </p>
          <p>
            Pendekatan pengembangan sistem di MBNP Tech menitikberatkan pada penggunaan teknologi modern, arsitektur sistem yang rapi, serta desain antarmuka yang responsif agar dapat memberikan pengalaman pengguna yang optimal.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FounderProfile = () => (
  <section className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
    
    <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-16">
      {/* Visual Profil Placeholder */}
      <div className="w-full lg:w-1/3">
        <div className="aspect-[4/5] bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center text-6xl mb-6 border-4 border-slate-700 group-hover:border-blue-500 transition-colors">
            👨‍💻
          </div>
          <h4 className="text-2xl font-black mb-2 relative z-10">M. Bayu N.P.</h4>
          <p className="text-blue-400 font-bold text-sm tracking-widest uppercase mb-4 relative z-10">FullStack Developer</p>
          <p className="text-slate-400 text-sm flex items-center gap-2 relative z-10">
            <span>📍</span> Bandung — Cianjur — Garut
          </p>
        </div>
      </div>

      {/* Deskripsi Profil */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Founder</h2>
        <h3 className="text-3xl md:text-5xl font-black mb-8">Muhammad Bayu Nurdiansyah Putra</h3>
        
        <div className="space-y-4 text-slate-300 text-lg leading-relaxed mb-10">
          <p>
            Muhammad Bayu Nurdiansyah Putra adalah seorang FullStack Developer dengan pengalaman dalam pengembangan sistem digital berbasis web selama lebih dari dua tahun.
          </p>
          <p>
            Ia merupakan lulusan Teknik Informatika dari UIN Bandung yang memiliki minat mendalam dalam pengembangan aplikasi web modern, portal data, dan sistem informasi yang mendukung transformasi digital.
          </p>
          <p>
            Dalam proses pengembangan sistem, Bayu menggunakan pendekatan teknologi modern yang memungkinkan pembangunan aplikasi web yang memiliki performa baik, struktur yang rapi, serta mudah untuk dikembangkan lebih lanjut di masa depan.
          </p>
        </div>

        {/* Info Kontak Cepat */}
        <div className="flex flex-wrap gap-4">
          <a href="mailto:muhammadbayunp@gmail.com" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition-colors font-medium text-sm">
            <FaEnvelope className="text-sky-400 text-lg" /> Email
          </a>
          <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition-colors font-medium text-sm">
            <FaWhatsapp className="text-green-400 text-lg" /> WhatsApp
          </a>
          <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-800 hover:bg-[#0A66C2] px-6 py-3 rounded-xl transition-colors font-medium text-sm">
            <FaLinkedin className="text-blue-400 text-lg" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  </section>
);

const ProfessionalBackground = () => (
  <section className="py-24 bg-white px-6">
    <div className="container mx-auto max-w-4xl text-center">
      <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Experience</h2>
      <h3 className="text-3xl font-black text-slate-900 mb-8">Professional Background</h3>
      
      <div className="text-slate-600 text-lg leading-relaxed space-y-6 text-left md:text-center">
        <p>
          Dengan pengalaman lebih dari dua tahun sebagai FullStack Developer, Bayu telah terlibat dalam pengembangan berbagai sistem berbasis web yang digunakan untuk kebutuhan organisasi, bisnis, maupun platform digital.
        </p>
        <p>
          Pengalaman ini meliputi pengembangan website modern, pembangunan sistem informasi berbasis web, serta pengembangan portal digital yang berfokus pada performa sistem, kemudahan penggunaan, dan skalabilitas teknologi.
        </p>
        <p>
          Sebagai seorang developer, Bayu memiliki fokus dalam membangun sistem yang tidak hanya berfungsi dengan baik tetapi juga memiliki struktur arsitektur yang rapi dan mudah dikembangkan.
        </p>
      </div>
    </div>
  </section>
);

const SkillsTech = () => {
  const stacks = [
    { icon: <FaCode />, title: "Frontend Development", items: ["React", "Next.js", "JavaScript", "Tailwind CSS", "HTML", "CSS"] },
    { icon: <FaServer />, title: "Backend Development", items: ["Node.js", "Express.js", "PHP", "Laravel"] },
    { icon: <FaDatabase />, title: "Database", items: ["MySQL", "PostgreSQL"] },
    { icon: <FaTools />, title: "Tools & Deployment", items: ["Git", "Linux Server", "Nginx", "Cloud Hosting"] }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Technology Stack</h2>
          <h3 className="text-3xl font-black text-slate-900 mb-6">Alat Kerja MBNP Tech</h3>
          <p className="text-slate-600">
            Dalam pengembangan sistem digital, MBNP Tech menggunakan berbagai teknologi modern yang mendukung pembangunan aplikasi web dengan performa yang baik serta arsitektur sistem yang scalable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stacks.map((stack, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                {stack.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-4">{stack.title}</h4>
              <ul className="space-y-3">
                {stack.items.map((item, i) => (
                  <li key={i} className="text-slate-600 font-medium text-sm flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xs" /> {item}
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

const WorkPhilosophy = () => (
  <section className="py-24 bg-white px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="bg-blue-600 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <FaQuoteLeft className="text-6xl text-blue-400 mb-6 opacity-50" />
            <h2 className="text-3xl font-black mb-4">Development Philosophy</h2>
          </div>
          <div className="w-full md:w-2/3 text-blue-50 text-lg leading-relaxed space-y-4">
            <p>
              Pengembangan sistem digital tidak hanya berfokus pada tampilan visual, tetapi juga pada kualitas struktur sistem, performa aplikasi, serta pengalaman pengguna yang baik.
            </p>
            <p className="font-semibold text-white">MBNP Tech menerapkan pendekatan pengembangan yang mengutamakan:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-white">
              <li className="flex items-center gap-2"><span className="text-sky-300">▹</span> Struktur kode yang rapi</li>
              <li className="flex items-center gap-2"><span className="text-sky-300">▹</span> Performa sistem optimal</li>
              <li className="flex items-center gap-2"><span className="text-sky-300">▹</span> Desain antarmuka responsif</li>
              <li className="flex items-center gap-2"><span className="text-sky-300">▹</span> Kemudahan scale-up sistem</li>
            </ul>
            <p className="pt-4 border-t border-blue-500/50 text-base">
              Pendekatan ini bertujuan untuk menghasilkan sistem digital yang tidak hanya berfungsi dengan baik tetapi juga memiliki kualitas teknis yang stabil.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProfessionalValues = () => {
  const values = [
    { title: "Quality", desc: "Setiap sistem dikembangkan dengan standar kualitas yang baik agar dapat berjalan stabil dan optimal." },
    { title: "Simplicity", desc: "Solusi digital yang baik adalah solusi yang sederhana namun efektif dalam menyelesaikan masalah." },
    { title: "Scalability", desc: "Sistem harus dirancang agar mudah dikembangkan seiring dengan kebutuhan yang terus berkembang." },
    { title: "Continuous Learning", desc: "Teknologi selalu berkembang, sehingga penting untuk terus mempelajari teknologi baru untuk meningkatkan kualitas." }
  ];

  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Core Values</h2>
          <h3 className="text-3xl font-black text-slate-900">Professional Values</h3>
          <p className="text-slate-600 mt-4">Beberapa nilai yang menjadi dasar dalam pengembangan sistem di MBNP Tech:</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 flex gap-4">
              <div className="text-3xl font-black text-slate-200">0{idx + 1}</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VisionGoals = () => (
  <section className="py-24 bg-white px-6 border-t border-slate-200">
    <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16">
      
      {/* Vision */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">👁️</div>
          <h3 className="text-2xl font-black text-slate-900">Vision</h3>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
          Mengembangkan platform teknologi yang mampu menghadirkan solusi digital modern untuk organisasi, bisnis, dan instansi yang membutuhkan sistem berbasis web yang efisien dan scalable.
        </p>
      </div>

      {/* Future Goals */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">🚀</div>
          <h3 className="text-2xl font-black text-slate-900">Future Goals</h3>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-slate-600 mb-4">Beberapa fokus pengembangan ke depan meliputi:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <span className="text-green-500 mt-1">✔</span> Pengembangan sistem web yang lebih kompleks
            </li>
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <span className="text-green-500 mt-1">✔</span> Pembangunan platform digital berbasis data
            </li>
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <span className="text-green-500 mt-1">✔</span> Pengembangan dashboard informasi
            </li>
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <span className="text-green-500 mt-1">✔</span> Pengembangan aplikasi berbasis web yang lebih scalable
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
);

const AboutCTA = () => (
  <section className="py-24 bg-slate-900 text-center px-6">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
        Let's Work <span className="text-blue-500">Together</span>
      </h2>
      <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
        Jika Anda membutuhkan website profesional, sistem informasi berbasis web, atau solusi digital lainnya, MBNP Tech siap membantu mengembangkan sistem yang sesuai dengan kebutuhan Anda.
      </p>
      <Link to="/contact" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all">
        Mulai Diskusi Proyek
      </Link>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const About = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <AboutHero />
      <AboutMBNPTech />
      <FounderProfile />
      <ProfessionalBackground />
      <SkillsTech />
      <WorkPhilosophy />
      <ProfessionalValues />
      <VisionGoals />
      <AboutCTA />
    </div>
  );
};

export default About;