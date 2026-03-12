// src/pages/public/Contact.tsx
import { useState, FormEvent } from 'react';
import { 
  FaWhatsapp, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebookF, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaUser, 
  FaPhoneAlt, 
  FaChevronDown 
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const Contact = () => {
  // State untuk mengontrol FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Fungsi submit dengan SweetAlert2
  const handleWhatsAppSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nama = (form.elements.namedItem('nama') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const layanan = (form.elements.namedItem('layanan') as HTMLSelectElement).value;
    const budget = (form.elements.namedItem('budget') as HTMLSelectElement).value;
    const pesan = (form.elements.namedItem('pesan') as HTMLTextAreaElement).value;

    const waText = `Halo MBNP Tech, saya ${nama} (${email}).%0A%0ASaya ingin konsultasi proyek:%0A- Jenis: ${layanan}%0A- Estimasi Budget: ${budget}%0A%0A*Deskripsi Kebutuhan:*%0A${pesan}`;
    
    // Tampilkan popup konfirmasi elegan
    Swal.fire({
      title: 'Kirim Pesan?',
      text: "Anda akan diarahkan ke WhatsApp untuk melanjutkan konsultasi.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Lanjutkan ke WA!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(`https://wa.me/6289663933263?text=${waText}`, '_blank');
        form.reset(); // Kosongkan form setelah terkirim
      }
    });
  };

  const faqs = [
    {
      q: "Berapa lama waktu pembuatan website?",
      a: "Waktu pengerjaan tergantung pada kompleksitas proyek. Website sederhana biasanya memerlukan waktu sekitar 2–4 minggu. Sedangkan untuk sistem informasi yang lebih kompleks bisa memakan waktu 1-3 bulan."
    },
    {
      q: "Apakah bisa maintenance website?",
      a: "Tentu. MBNP Tech menyediakan layanan maintenance, keamanan server, dan pengembangan fitur lanjutan setelah website atau sistem Anda selesai di-deploy."
    },
    {
      q: "Apakah bisa membuat sistem informasi yang kompleks?",
      a: "Ya. Kami berpengalaman membangun arsitektur sistem informasi berbasis web seperti sistem administrasi pemerintahan, portal data publik, dan dashboard monitoring dengan integrasi API."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1️⃣ Hero Section */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden text-center px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-6 border border-blue-100">
            Let's Connect
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">MBNP Tech</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-8">
            Mari Diskusikan Proyek Digital Anda
          </h2>
          <div className="p-6 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            MBNP Tech terbuka untuk berbagai jenis proyek pengembangan website dan sistem berbasis web. Baik untuk kebutuhan bisnis, organisasi, maupun instansi pemerintahan. Kami menyediakan layanan konsultasi untuk memahami kebutuhan sistem Anda sehingga solusi yang dikembangkan tepat sasaran.
          </div>
        </div>
      </section>

      {/* 2️⃣ Contact Info & Form */}
      <section className="py-24 px-6 relative z-20 -mt-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Bagian Kiri: Info Kontak (2 Kolom di Grid 5) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span> Informasi Kontak
            </h3>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/20 flex items-start gap-5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md">
                <FaUser />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Developer</h4>
                <p className="text-slate-600 font-medium mt-1">Muhammad Bayu Nurdiansyah Putra</p>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">Web & System Developer</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/20 flex items-start gap-5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Location</h4>
                <p className="text-slate-600 font-medium mt-1">Bandung • Cianjur • Garut</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Indonesia</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/20 flex items-start gap-5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md">
                <FaEnvelope />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email</h4>
                <a href="mailto:muhammadbayunp@gmail.com" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium mt-1 block">
                  muhammadbayunp@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/20 flex items-start gap-5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">WhatsApp</h4>
                <p className="text-slate-600 font-medium mt-1 mb-3">0896-6393-3263</p>
                <a 
                  href="https://wa.me/6289663933263" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> Chat Sekarang
                </a>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Form Konsultasi (3 Kolom di Grid 5) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
              <h3 className="text-3xl font-black text-slate-900 mb-3">Mulai Konsultasi</h3>
              <p className="text-slate-500 mb-10">Jelaskan ide atau kebutuhan sistem Anda secara detail.</p>
              
              <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" name="nama" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Valid</label>
                    <input type="email" name="email" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all" placeholder="email@perusahaan.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Proyek</label>
                    <div className="relative">
                      <select name="layanan" required className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all appearance-none cursor-pointer">
                        <option value="Website Company Profile">Website Company Profile</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                        <option value="Portal Data">Portal Data</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimasi Budget (Opsional)</label>
                    <div className="relative">
                      <select name="budget" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all appearance-none cursor-pointer">
                        <option value="Belum ditentukan">Pilih range budget</option>
                        <option value="< 5 juta">&lt; 5 Juta</option>
                        <option value="5 - 10 juta">5 – 10 Juta</option>
                        <option value="10 - 20 juta">10 – 20 Juta</option>
                        <option value="> 20 juta">&gt; 20 Juta</option>
                      </select>
                      <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Proyek</label>
                  <textarea name="pesan" required rows={5} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none bg-slate-50 transition-all resize-none" placeholder="Ceritakan fitur, tujuan utama, atau masalah yang ingin diselesaikan..."></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all text-lg flex items-center justify-center gap-2 group">
                  Kirim Pesan <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3️⃣ Social Media Section */}
      <section className="py-24 bg-white px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Social Networks</h2>
            <h3 className="text-3xl font-black text-slate-900">Terhubung Lebih Dekat</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="group p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 transition-all text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl text-[#0A66C2] mb-6 group-hover:scale-110 transition-transform">
                <FaLinkedin />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">LinkedIn</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Lihat rekam jejak profesional, pengalaman kerja, dan histori project saya.</p>
            </a>

            <a href="https://www.instagram.com/m.bayunp/" target="_blank" rel="noopener noreferrer" className="group p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#E1306C] hover:bg-[#E1306C]/5 transition-all text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl text-[#E1306C] mb-6 group-hover:scale-110 transition-transform">
                <FaInstagram />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Instagram</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Berbagi aktivitas harian, karya visual, dan insight seputar dunia digital.</p>
            </a>

            <a href="https://www.facebook.com/bayu.bojongiv" target="_blank" rel="noopener noreferrer" className="group p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl text-[#1877F2] mb-6 group-hover:scale-110 transition-transform">
                <FaFacebookF />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Facebook</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Mari berteman dan ikuti update terbaru seputar keseharian dan teknologi.</p>
            </a>
          </div>
        </div>
      </section>

      {/* 4️⃣ FAQ Section (Accordion Modern) */}
      <section className="py-24 bg-slate-50 px-6 border-t border-slate-200">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">FAQ</h2>
            <h3 className="text-3xl font-black text-slate-900">Pertanyaan Umum</h3>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`bg-white rounded-2xl border transition-colors ${openFaq === index ? 'border-blue-400 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                <button 
                  onClick={() => toggleFaq(index)} 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg pr-4 ${openFaq === index ? 'text-blue-600' : 'text-slate-800'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                    <FaChevronDown />
                  </div>
                </button>
                
                {/* Accordion Content Animation via Tailwind Grid */}
                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 mt-2">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Call To Action */}
      <section className="py-24 bg-slate-900 text-center px-6 relative overflow-hidden">
        {/* Dekorasi Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            Siap Memulai Proyek <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Digital Anda?</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            MBNP Tech siap membantu Anda membangun ekosistem digital yang modern, cepat, dan terukur.
          </p>
          <a 
            href="https://wa.me/6289663933263"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            <FaWhatsapp className="text-2xl" /> Mulai Chat Sekarang
          </a>
        </div>
      </section>

    </div>
  );
};

export default Contact;