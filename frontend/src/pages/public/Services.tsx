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
  FaCheckCircle
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---

const ServicesHero = () => (
  <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900 text-white text-center px-6">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
    <div className="container mx-auto max-w-4xl relative z-10">
      <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/20 text-sky-300 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-500/30">
        Our Expertise
      </span>
      <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
        Professional Web <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Development Services</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
        MBNP Tech menyediakan layanan pengembangan website, sistem informasi, dan aplikasi berbasis web dengan teknologi modern untuk membantu bisnis, organisasi, dan instansi pemerintahan dalam membangun solusi digital yang efektif dan scalable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all">
          Konsultasi Proyek
        </Link>
        <Link to="/projects" className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-all">
          Lihat Portfolio
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-400">
        <span className="flex items-center gap-2"><span className="text-sky-400">✔</span> Modern Technology Stack</span>
        <span className="flex items-center gap-2"><span className="text-sky-400">✔</span> Scalable Web System</span>
        <span className="flex items-center gap-2"><span className="text-sky-400">✔</span> Responsive Design</span>
        <span className="flex items-center gap-2"><span className="text-sky-400">✔</span> Professional Development</span>
      </div>
    </div>
  </section>
);

const ServicesOverview = () => (
  <section className="py-20 bg-white px-6">
    <div className="container mx-auto max-w-4xl text-center">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Solusi Digital Terpadu</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-6">
        MBNP Tech menghadirkan solusi pengembangan website dan sistem informasi yang dirancang untuk memenuhi kebutuhan digital organisasi modern. Dengan pendekatan teknologi yang terstruktur dan desain yang responsif, setiap proyek dikembangkan untuk memberikan performa optimal dan pengalaman pengguna yang baik.
      </p>
      <p className="text-lg text-slate-600 leading-relaxed">
        Kami mengembangkan berbagai jenis sistem mulai dari website company profile, portal data, hingga aplikasi berbasis web untuk administrasi dan operasional organisasi.
      </p>
    </div>
  </section>
);

const CoreServices = () => {
  const services = [
    {
      icon: <FaGlobe />,
      title: "Website Development",
      desc: "Pembuatan website profesional untuk perusahaan, organisasi, dan instansi pemerintahan.",
      features: ["Responsive design", "Modern UI/UX", "SEO friendly", "Fast performance", "Scalable architecture"],
      examples: "Company profile, Website organisasi, Website instansi"
    },
    {
      icon: <FaLaptopCode />,
      title: "Web App Development",
      desc: "Pengembangan aplikasi berbasis web untuk mendukung operasional organisasi.",
      features: ["React", "Express.js", "Node.js", "Custom Workflow"],
      examples: "Sistem absensi, Sistem manajemen data, Dashboard monitoring, Sistem administrasi"
    },
    {
      icon: <FaChartBar />,
      title: "Data Portal & Dashboard",
      desc: "Pengembangan portal data dan dashboard visualisasi informasi.",
      features: ["Grafik interaktif", "Manajemen dataset", "Publikasi infografis", "Data Analytics"],
      examples: "Portal statistik, Open data portal, Dashboard monitoring"
    },
    {
      icon: <FaBuilding />,
      title: "Corporate Website",
      desc: "Website profesional untuk meningkatkan kredibilitas perusahaan.",
      features: ["Desain profesional", "Halaman layanan", "Halaman portfolio", "Integrasi kontak"],
      examples: "IMN Business Group, Corporate landing pages"
    },
    {
      icon: <FaTools />,
      title: "Website Maintenance",
      desc: "Layanan pengembangan lanjutan dan maintenance sistem yang sudah berjalan.",
      features: ["Update sistem", "Optimasi performa", "Perbaikan bug", "Penambahan fitur baru"],
      examples: "Retainer bulanan, On-demand support"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Core Services</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">Layanan Utama Kami</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col h-full">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">{srv.icon}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{srv.title}</h4>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow">{srv.desc}</p>
              
              <div className="mb-6">
                <strong className="text-xs text-slate-900 uppercase tracking-wider block mb-2">Fitur / Teknologi:</strong>
                <ul className="space-y-1">
                  {srv.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <strong className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Contoh Penggunaan:</strong>
                <p className="text-xs text-slate-700 font-medium">{srv.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceDetails = () => {
  const details = [
    { title: "Responsive Design", desc: "Website dirancang agar dapat berjalan dengan baik di berbagai perangkat seperti desktop, tablet, dan smartphone." },
    { title: "Modern User Interface", desc: "Desain antarmuka yang modern dan intuitif untuk meningkatkan pengalaman pengguna (UX)." },
    { title: "Fast Performance", desc: "Website dioptimalkan untuk performa cepat sehingga memberikan pengalaman browsing yang nyaman." },
    { title: "Secure System", desc: "Sistem dikembangkan dengan mempertimbangkan keamanan data dari serangan siber dan stabilitas server." },
    { title: "Scalable Architecture", desc: "Arsitektur kode dirancang agar mudah dikembangkan (scalable) ketika kebutuhan fitur sistem bertambah." }
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 md:w-2/3">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Service Details</h2>
          <h3 className="text-3xl font-black text-slate-900">Standar Kualitas Pengembangan</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {details.map((detail, index) => (
            <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-3">{detail.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechApproach = () => {
  const stacks = [
    { title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "JavaScript"] },
    { title: "Backend", items: ["Node.js", "Express.js", "PHP", "Laravel"] },
    { title: "Database", items: ["MySQL", "PostgreSQL", "Laragon", "MongoDB"] },
    { title: "Deployment", items: ["Linux Server", "Nginx", "Cloud Hosting"] }
  ];
  return (
    <section className="py-24 bg-slate-900 text-white px-6">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-3">Technology Approach</h2>
        <h3 className="text-3xl font-black mb-16">Teknologi Modern & Enterprise-Grade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stacks.map((category, index) => (
            <div key={index} className="p-6 rounded-2xl bg-slate-800 border border-slate-700 text-left">
              <h4 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">{category.title}</h4>
              <ul className="space-y-3">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>{item}
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

const IndustrySolutions = () => {
  const industries = [
    { title: "Government", desc: "Pengembangan portal data, website instansi, dan sistem administrasi digital.", example: "Portal Statistik Garut, Portal Garut Satu Data" },
    { title: "Creative Industry", desc: "Website portfolio dan platform digital untuk studio kreatif.", example: "Picme Studio" },
    { title: "Corporate", desc: "Website profil perusahaan profesional untuk B2B dan B2C.", example: "IMN Business Group" },
    { title: "Organization / Community", desc: "Website terintegrasi untuk organisasi, komunitas, atau lembaga pendidikan.", example: "Sistem Absensi Geolocation" }
  ];
  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Industry Solutions</h2>
          <h3 className="text-3xl font-black text-slate-900">Siap Mendukung Berbagai Sektor</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((ind, index) => (
            <div key={index} className="flex gap-4 p-6 border border-slate-200 rounded-3xl hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black shrink-0">{index + 1}</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{ind.title}</h4>
                <p className="text-slate-600 text-sm mb-3">{ind.desc}</p>
                <p className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">Contoh: {ind.example}</p>
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
    { num: "1", title: "Requirement Analysis", desc: "Memahami kebutuhan client dan tujuan utama sistem yang akan dibangun." },
    { num: "2", title: "System Planning", desc: "Perancangan arsitektur sistem, skema database, dan pembuatan desain UI/UX." },
    { num: "3", title: "Development", desc: "Proses penulisan kode (pengembangan) sistem menggunakan teknologi modern." },
    { num: "4", title: "Testing", desc: "Pengujian fungsionalitas sistem untuk memastikan stabilitas dan kualitas kode." },
    { num: "5", title: "Deployment", desc: "Sistem di-deploy ke server produksi (live) dan siap digunakan oleh pengguna." },
    { num: "6", title: "Maintenance", desc: "Support teknis pasca-rilis dan pengembangan fitur lanjutan sesuai kebutuhan." }
  ];
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Development Process</h2>
          <h3 className="text-3xl font-black text-slate-900">SOP Profesional Kami</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-4xl font-black text-slate-200 mb-4">0{step.num}</div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MaintenanceSupport = () => (
  <section className="py-24 bg-blue-600 text-white px-6">
    <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-3xl font-black mb-6">Maintenance & Support</h2>
        <p className="text-blue-100 text-lg leading-relaxed mb-6">
          Pengembangan website tidak berhenti saat peluncuran. MBNP Tech menyediakan layanan maintenance komprehensif untuk memastikan website atau sistem yang telah dikembangkan tetap berjalan optimal dan aman.
        </p>
      </div>
      <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20">
        <h3 className="font-bold text-xl mb-6">Layanan Yang Tersedia:</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3"><FaCheckCircle className="text-sky-300" /> Update & Keamanan Sistem</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-sky-300" /> Monitoring Performa Server</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-sky-300" /> Perbaikan Bug (Bug Fixing)</li>
          <li className="flex items-center gap-3"><FaCheckCircle className="text-sky-300" /> Pengembangan Fitur Tambahan</li>
        </ul>
      </div>
    </div>
  </section>
);

const ServicesFAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "Berapa biaya pembuatan website?", a: "Biaya pembuatan website bergantung pada kompleksitas sistem dan fitur yang dibutuhkan. Untuk mendapatkan estimasi biaya (RAB) yang akurat, silakan hubungi kami melalui halaman contact untuk berdiskusi lebih lanjut." },
    { q: "Berapa lama waktu pengerjaan?", a: "Waktu pengerjaan umumnya berkisar antara 2 hingga 8 minggu tergantung pada kompleksitas proyek dan kesiapan materi dari pihak klien." },
    { q: "Apakah bisa mengembangkan sistem yang sudah ada (existing)?", a: "Ya, MBNP Tech sangat terbuka menerima proyek pengembangan lanjutan (scale-up), refactoring kode, atau perbaikan bug pada sistem yang sudah ada sebelumnya." }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">FAQ Services</h2>
          <h3 className="text-3xl font-black text-slate-900">Pertanyaan Seputar Layanan</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className={`bg-white rounded-2xl border transition-colors ${openFaq === index ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <span className={`font-bold text-lg pr-4 ${openFaq === index ? 'text-blue-600' : 'text-slate-800'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                  <FaChevronDown />
                </div>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 mt-2">{faq.a}</div>
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
  <section className="py-24 bg-slate-50 text-center px-6 border-t border-slate-200">
    <div className="container mx-auto max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Butuh Website atau Sistem Digital?</h2>
      <p className="text-slate-600 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
        MBNP Tech siap membantu mengembangkan website profesional, portal data, dan aplikasi berbasis web untuk mendukung transformasi digital organisasi Anda.
      </p>
      <Link to="/contact" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all">
        Konsultasi Proyek Sekarang
      </Link>
    </div>
  </section>
);

// --- MAIN COMPONENT ---

const Services = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ServicesHero />
      <ServicesOverview />
      <CoreServices />
      <ServiceDetails />
      <TechApproach />
      <IndustrySolutions />
      <DevelopmentProcess />
      <MaintenanceSupport />
      <ServicesFAQ />
      <ServicesCTA />
    </div>
  );
};

export default Services;