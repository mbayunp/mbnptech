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
  FaChevronDown,
  FaArrowRight
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleWhatsAppSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const nama = (form.elements.namedItem('nama') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const layanan = (form.elements.namedItem('layanan') as HTMLSelectElement).value;
    const budget = (form.elements.namedItem('budget') as HTMLSelectElement).value;
    const pesan = (form.elements.namedItem('pesan') as HTMLTextAreaElement).value;

    const waText = `Halo MBNP Tech, saya ${nama} (${email}).%0A%0ASaya ingin konsultasi proyek:%0A- Jenis: ${layanan}%0A- Estimasi Budget: ${budget}%0A%0A*Deskripsi Kebutuhan:*%0A${pesan}`;

    try {
      // 1. POST Data ke Database via API
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama, email, phone, service: layanan, budget, message: pesan })
      });

      if (res.ok) {
        // 2. Jika sukses tersimpan, tampilkan konfirmasi ke WA
        Swal.fire({
          title: 'Pesan Terkirim ke Sistem!',
          text: "Lanjutkan ke WhatsApp untuk mengobrol langsung dengan developer.",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#2563EB',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Ya, Buka WA!',
          cancelButtonText: 'Tutup',
          customClass: {
            popup: 'rounded-[2rem]',
            confirmButton: 'rounded-xl px-6 py-3 font-bold',
            cancelButton: 'rounded-xl px-6 py-3 font-bold'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(`https://wa.me/6289663933263?text=${waText}`, '_blank');
          }
          form.reset();
        });
      } else {
        Swal.fire('Error', 'Gagal mengirim pesan ke sistem. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">

      {/* 1️⃣ Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#fafafa] text-center px-4 md:px-6">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[80%] md:w-[50%] h-[60%] bg-blue-400/20 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/4 translate-x-1/4 mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 w-[80%] md:w-[50%] h-[60%] bg-sky-400/20 rounded-full blur-[80px] md:blur-[120px] translate-y-1/4 -translate-x-1/4 mix-blend-multiply"></div>
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm mb-6 md:mb-8">
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-blue-600"></span>
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-800 tracking-wide uppercase">Let's Connect</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-[1.05]">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">MBNP</span>
          </h1>
          <h2 className="text-lg md:text-2xl font-bold text-slate-700 mb-8 md:mb-10 px-2">
            Mari Diskusikan Ide Hebat Anda Hari Ini.
          </h2>
        </div>
      </section>

      {/* 2️⃣ Contact Info & Form (Bento Layout) */}
      <section className="py-12 md:py-24 px-4 md:px-6 relative z-20 -mt-10 md:-mt-16">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">

          {/* Bagian Kiri: Info Kontak */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-3">
              Informasi Kontak
            </h3>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 md:gap-5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FaUser />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 md:text-lg">Developer</h4>
                <p className="text-slate-600 font-medium text-sm md:text-base mt-0.5">M. Bayu Nurdiansyah P.</p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 md:gap-5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 md:text-lg">Location</h4>
                <p className="text-slate-600 font-medium text-sm md:text-base mt-0.5">Bandung • Cianjur • Garut</p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 md:gap-5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FaEnvelope />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 md:text-lg">Email</h4>
                <a href="mailto:muhammadbayunp@gmail.com" className="text-slate-600 hover:text-indigo-600 font-medium text-sm md:text-base mt-0.5 block truncate">
                  muhammadbayunp@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 md:gap-5 transition-all group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <FaWhatsapp />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 md:text-lg">WhatsApp</h4>
                <p className="text-slate-600 font-medium text-sm md:text-base mt-0.5">0896-6393-3263</p>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Form Konsultasi */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Kirim Pesan</h3>
              <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium">Jelaskan ide atau kebutuhan sistem Anda secara mendetail.</p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-5 md:space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nama Lengkap</label>
                    <input type="text" name="nama" required className="w-full px-5 py-3.5 md:py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Valid</label>
                    <input type="email" name="email" required className="w-full px-5 py-3.5 md:py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all" placeholder="email@perusahaan.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nomor WhatsApp</label>
                    <input type="text" name="phone" required className="w-full px-5 py-3.5 md:py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all" placeholder="08..." />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Jenis Proyek</label>
                    <div className="relative">
                      <select name="layanan" required className="w-full px-5 py-3.5 md:py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all appearance-none cursor-pointer">
                        <option value="Website Company Profile">Website Company Profile</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                        <option value="Portal Data">Portal Data</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Estimasi Budget</label>
                    <div className="relative">
                      <select name="budget" className="w-full px-5 py-3.5 md:py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all appearance-none cursor-pointer">
                        <option value="Belum ditentukan">Pilih range budget</option>
                        <option value="< 5 juta">&lt; 5 Juta</option>
                        <option value="5 - 10 juta">5 – 10 Juta</option>
                        <option value="10 - 20 juta">10 – 20 Juta</option>
                        <option value="> 20 juta">&gt; 20 Juta</option>
                      </select>
                      <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                    </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Deskripsi Proyek</label>
                  <textarea name="pesan" required rows={4} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all resize-none" placeholder="Ceritakan fitur utama atau masalah yang ingin diselesaikan..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 md:py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all text-base md:text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Mengirim...' : <>Kirim via WhatsApp <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" /></>}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3️⃣ Social Media Section */}
      <section className="py-16 md:py-24 bg-white px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">Social Networks</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Terhubung Lebih Dekat</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
            <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="group p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#0A66C2] hover:bg-[#0A66C2]/5 transition-all text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl md:text-3xl text-[#0A66C2] mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-[#0A66C2] group-hover:text-white transition-all">
                <FaLinkedin />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">LinkedIn</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">Rekam jejak profesional & histori project.</p>
            </a>

            <a href="https://www.instagram.com/m.bayunp/" target="_blank" rel="noopener noreferrer" className="group p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#E1306C] hover:bg-[#E1306C]/5 transition-all text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl md:text-3xl text-[#E1306C] mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-[#F56040] group-hover:to-[#C13584] group-hover:text-white transition-all">
                <FaInstagram />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Instagram</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">Karya visual & insight seputar dunia digital.</p>
            </a>

            <a href="https://www.facebook.com/bayu.bojongiv" target="_blank" rel="noopener noreferrer" className="group p-6 md:p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl md:text-3xl text-[#1877F2] mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                <FaFacebookF />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">Facebook</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">Update terbaru seputar keseharian teknologi.</p>
            </a>
          </div>
        </div>
      </section>

      {/* 4️⃣ FAQ Section */}
      <section className="py-16 md:py-24 bg-[#fafafa] px-4 md:px-6 border-t border-slate-100">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-xs md:text-sm font-black text-blue-600 uppercase tracking-widest mb-3">FAQ</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Pertanyaan Umum</h3>
          </div>

          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`bg-white rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-blue-300 shadow-lg shadow-blue-100/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none">
                  <span className={`font-bold text-base md:text-lg pr-4 transition-colors ${openFaq === index ? 'text-blue-600' : 'text-slate-800'}`}>
                    {faq.q}
                  </span>
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

      {/* 5️⃣ Call To Action */}
      <section className="py-20 md:py-32 bg-[#0F172A] text-white text-center px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-3xl relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tight leading-[1.1]">
            Masih Ragu? <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Mari Mengobrol.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-xl mb-10 md:mb-12 leading-relaxed font-medium px-4">
            Konsultasi awal gratis! Jangan ragu untuk membicarakan rencana atau kendala sistem yang sedang Anda hadapi.
          </p>
          <a
            href="https://wa.me/6289663933263"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-white text-slate-900 rounded-[2rem] font-black text-lg md:text-xl hover:bg-slate-100 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all group w-full sm:w-auto"
          >
            Chat WhatsApp <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

    </div>
  );
};

export default Contact;