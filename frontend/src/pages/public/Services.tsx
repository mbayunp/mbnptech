// src/pages/public/Services.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGlobe,
  FaLaptopCode,
  FaChartBar,
  FaBuilding,
  FaTools,
  FaChevronDown,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const ServicesHero = () => (
  <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center pb-20 md:pb-32 overflow-hidden bg-[#0B1120] text-white">
    {/* Modern Dark Animated Gradient Background blobs */}
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[80%] md:w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] md:blur-[150px] mix-blend-screen"></div>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>

    <div className="container mx-auto px-4 md:px-6 relative z-10 pt-24 md:pt-32 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm mb-6 md:mb-8">
          <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-sky-500"></span>
          </span>
          <span className="text-xs md:text-sm font-bold text-sky-300 tracking-wide uppercase">Layanan Utama Kami</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white tracking-tight mb-6 md:mb-8 leading-[1.1] md:leading-[1.05]">
          Professional Web <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500">
            Development
          </span>
        </h1>

        <p className="text-base md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2">
          Membantu bisnis, organisasi, dan instansi pemerintahan membangun ekosistem digital yang efektif, interaktif, dan scalable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center px-4 mb-12">
          <Link to="/contact" className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-base md:text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/30 flex justify-center items-center gap-2">
            <span className="relative z-10">Konsultasi Proyek</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/projects" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 transition-all hover:scale-105 flex justify-center items-center">
            Lihat Portfolio
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm font-semibold text-slate-400 px-4">
          <span className="flex items-center gap-2"><FaCheckCircle className="text-sky-400" /> Modern Tech Stack</span>
          <span className="flex items-center gap-2"><FaCheckCircle className="text-sky-400" /> Scalable System</span>
          <span className="flex items-center gap-2"><FaCheckCircle className="text-sky-400" /> Clean Architecture</span>
        </div>
      </div>
    </div>
  </section>
);

const ServicesOverview = () => (
  <section className="py-16 md:py-24 bg-white relative z-20 -mt-8 md:-mt-16 rounded-t-[2rem] md:rounded-t-[3rem] border-t border-slate-100 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
    <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
      <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Solusi Terpadu</h2>
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 md:mb-8">Transformasi Digital End-to-End</h3>
      <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium mb-6 px-4">
        MBNP Tech menghadirkan solusi pengembangan website dan sistem informasi yang dirancang presisi untuk memenuhi kebutuhan organisasi modern. Dari arsitektur awal hingga rilis produksi.
      </p>
    </div>
  </section>
);

const CoreServices = () => {
  const services = [
    {
      icon: <FaGlobe />,
      title: "Website Development",
      desc: "Pembuatan website profesional untuk perusahaan, organisasi, dan instansi pemerintahan dengan standar UI/UX tinggi.",
      features: ["Responsive design", "SEO friendly", "Fast performance", "Modern CMS"],
      examples: "Company profile, Web instansi, Landing pages"
    },
    {
      icon: <FaLaptopCode />,
      title: "Web App Development",
      desc: "Pengembangan aplikasi berbasis web (SaaS / Internal App) untuk mendukung otomatisasi operasional organisasi.",
      features: ["React & Node.js", "Custom Workflow", "Role Management", "API Integration"],
      examples: "Sistem absensi, ERP, Sistem administrasi"
    },
    {
      icon: <FaChartBar />,
      title: "Data Portal & Dashboard",
      desc: "Pengembangan portal data terpusat dan dashboard visualisasi untuk pengambilan keputusan strategis.",
      features: ["Grafik interaktif", "Manajemen dataset", "Real-time analytics", "Export reporting"],
      examples: "Portal statistik, Open data, Dashboard monitoring"
    },
    {
      icon: <FaBuilding />,
      title: "Corporate Website",
      desc: "Pembangunan identitas digital perusahaan untuk meningkatkan kredibilitas B2B maupun B2C.",
      features: ["Desain eksklusif", "Katalog layanan", "Portfolio showcase", "Lead generation"],
      examples: "Situs korporasi, Agensi kreatif"
    },
    {
      icon: <FaTools />,
      title: "Maintenance & Scale Up",
      desc: "Layanan perbaikan bug, refactoring kode, dan pengembangan fitur baru pada sistem yang sudah berjalan.",
      features: ["Optimasi performa", "Security patch", "Server monitoring", "Version upgrade"],
      examples: "Retainer bulanan, On-demand support"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Core Services</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Keahlian & Spesialisasi</h3>
        </div>

        {/* Bento Grid Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
          {services.map((srv, idx) => (
            <div key={idx} className={`bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group ${idx === 0 || idx === 1 ? 'lg:col-span-1' : ''} ${idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {srv.icon}
              </div>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">{srv.title}</h4>
              <p className="text-slate-500 mb-6 text-sm md:text-base leading-relaxed font-medium flex-grow">{srv.desc}</p>

              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <strong className="text-[10px] text-slate-400 uppercase tracking-widest block mb-3">Fitur Kunci:</strong>
                <ul className="space-y-2">
                  {srv.features.map((feat, i) => (
                    <li key={i} className="text-xs md:text-sm text-slate-700 font-semibold flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500 text-[10px]" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Penggunaan Umum:</strong>
                <p className="text-xs md:text-sm text-slate-600 font-bold">{srv.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IndustrySolutions = () => {
  const industries = [
    { title: "Government / Pemerintahan", desc: "Mendukung SPBE dengan portal data, website instansi, dan sistem administrasi yang aman.", example: "Portal Statistik, Garut Satu Data" },
    { title: "Creative & Studio", desc: "Website portfolio berkinerja tinggi dan platform interaktif untuk menampilkan karya secara elegan.", example: "Picme Studio, Agency Web" },
    { title: "Corporate / Perusahaan", desc: "Profil perusahaan profesional untuk memperkuat citra brand di mata klien dan investor.", example: "IMN Business Group" },
    { title: "Organization & Education", desc: "Sistem terintegrasi untuk manajemen komunitas, absensi, dan administrasi lembaga.", example: "Sistem Absensi Geolocation" }
  ];

  return (
    <section className="py-16 md:py-24 bg-white px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 md:mb-16 md:w-2/3 text-center md:text-left mx-auto md:mx-0">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Industry Solutions</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Menyelesaikan Masalah di Berbagai Sektor</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {industries.map((ind, index) => (
            <div key={index} className="bg-[#fafafa] p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 items-start hover:border-blue-200 transition-colors group">
              <div className="text-5xl md:text-6xl font-black text-slate-200 group-hover:text-blue-100 transition-colors leading-none shrink-0">
                0{index + 1}
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-black text-slate-800 mb-2 tracking-tight">{ind.title}</h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mb-4">{ind.desc}</p>
                <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  Use Case: {ind.example}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DevelopmentProcess = () => {
  const steps = [
    { num: "1", title: "Riset & Analisis", desc: "Membedah kebutuhan bisnis dan tujuan utama sistem secara mendalam." },
    { num: "2", title: "System Architecture", desc: "Merancang skema database, alur API, dan Wireframe UI/UX." },
    { num: "3", title: "Coding & Dev", desc: "Implementasi kode dengan tumpukan teknologi modern (React/Node)." },
    { num: "4", title: "UAT & Testing", desc: "Pengujian fungsionalitas, keamanan, dan performa secara ketat." },
    { num: "5", title: "Deployment", desc: "Rilis ke server produksi dengan konfigurasi domain dan SSL." },
    { num: "6", title: "Support & Scale", desc: "Pemeliharaan berkelanjutan dan optimasi untuk jutaan pengguna." }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#0F172A] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xs md:text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Development Workflow</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">SOP Standar Industri</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800 transition-colors group relative">
              <div className="absolute top-6 right-8 text-6xl font-black text-slate-700/30 group-hover:text-blue-500/10 transition-colors">
                {step.num}
              </div>
              <div className="relative z-10">
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 mt-8">{step.title}</h4>
                <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MaintenanceSupport = () => (
  <section className="py-16 md:py-24 bg-white px-4 md:px-6">
    <div className="container mx-auto max-w-6xl">
      {/* Bento Block Gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20 flex flex-col lg:flex-row gap-10 md:gap-16 items-center">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">
            Long-term Partner
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight">Maintenance & Support</h2>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed font-medium">
            Pengembangan aplikasi tidak berhenti saat hari peluncuran. Kami memastikan ekosistem digital Anda tetap aman, ter-update, dan berkinerja maksimal setiap harinya.
          </p>
        </div>

        <div className="w-full lg:w-1/2 relative z-10">
          <div className="bg-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-inner">
            <h3 className="font-black text-lg md:text-xl mb-6">Paket Layanan Termasuk:</h3>
            <ul className="space-y-4">
              {[
                "Update Teknologi & Keamanan Framework",
                "Monitoring Server & Database Backup",
                "Pemecahan Masalah (Bug Fixing) Cepat",
                "Penambahan Modul & Skalabilitas Fitur"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-medium text-sm md:text-base text-blue-50">
                  <FaCheckCircle className="text-sky-300 mt-1 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesFAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Berapa estimasi biaya pembuatan sistem atau website?", a: "Biaya sangat bergantung pada tingkat kompleksitas fitur, jumlah halaman, dan infrastruktur server yang digunakan. Silakan jadwalkan konsultasi gratis agar kami dapat menyusun Rencana Anggaran Biaya (RAB) yang presisi untuk Anda." },
    { q: "Berapa lama timeline pengerjaan rata-rata?", a: "Untuk website company profile biasanya memakan waktu 2-3 minggu. Sedangkan untuk web app/sistem informasi kompleks (seperti ERP atau portal data) membutuhkan waktu 4-12 minggu." },
    { q: "Apakah MBNP Tech menerima perbaikan/scale-up sistem existing?", a: "Tentu. Kami sering menangani proses refactoring kode, migrasi database, perbaikan bug kritis, hingga penambahan fitur pada sistem legacy (yang sudah ada sebelumnya)." }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">FAQ</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Pertanyaan Umum</h3>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className={`bg-white rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-blue-300 shadow-lg shadow-blue-100/50' : 'border-slate-200 hover:border-slate-300'}`}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none">
                <span className={`font-bold text-base md:text-lg pr-4 transition-colors ${openFaq === index ? 'text-blue-600' : 'text-slate-800'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                  <FaChevronDown className="text-xs" />
                </div>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-5 md:p-6 pt-0 text-slate-500 font-medium leading-relaxed text-sm md:text-base border-t border-slate-50 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesCTA = () => (
  <section className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-sky-100/50 to-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tight">
        Siap Memulai <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Proyek Anda?</span>
      </h2>
      <p className="text-base sm:text-lg md:text-2xl text-slate-600 mb-8 md:mb-12 max-w-2xl mx-auto font-medium px-4">
        Ceritakan kebutuhan spesifik organisasi Anda, dan mari kita rancang arsitektur sistem digital yang sempurna bersama-sama.
      </p>
      <Link to="/contact" className="inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-black hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all group border border-slate-700 shadow-xl w-full sm:w-auto">
        Jadwalkan Konsultasi
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-200 selection:text-blue-900">
      <ServicesHero />
      <ServicesOverview />
      <CoreServices />
      <IndustrySolutions />
      <DevelopmentProcess />
      <MaintenanceSupport />
      <ServicesFAQ />
      <ServicesCTA />
    </div>
  );
};

export default Services;