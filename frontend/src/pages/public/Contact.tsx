// src/pages/public/Contact.tsx
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhoneCall, FiLinkedin, FiInstagram, FiFacebook,
  FiMail, FiMapPin, FiUser, FiChevronDown, FiArrowRight, FiMessageSquare
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { fadeUp, stagger } from '../../utils/animations';

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama, email, phone, service: layanan, budget, message: pesan })
      });

      if (res.ok) {
        Swal.fire({
          title: 'Pesan Terkirim ke Sistem!',
          text: 'Lanjutkan ke WhatsApp untuk mengobrol langsung dengan developer.',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#2563EB',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Ya, Buka WA!',
          cancelButtonText: 'Tutup',
          customClass: { popup: 'rounded-[2rem]', confirmButton: 'rounded-xl px-6 py-3 font-bold', cancelButton: 'rounded-xl px-6 py-3 font-bold' }
        }).then((result) => {
          if (result.isConfirmed) window.open(`https://wa.me/6289663933263?text=${waText}`, '_blank');
          form.reset();
        });
      } else {
        Swal.fire('Error', 'Gagal mengirim pesan. Silakan coba lagi.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan koneksi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: 'Berapa lama waktu pembuatan website?', a: 'Waktu pengerjaan tergantung kompleksitas proyek. Website sederhana biasanya memerlukan waktu sekitar 2–4 minggu. Sistem informasi yang lebih kompleks bisa memakan waktu 1-3 bulan.' },
    { q: 'Apakah bisa maintenance website?', a: 'Tentu. MBNP Tech menyediakan layanan maintenance, keamanan server, dan pengembangan fitur lanjutan setelah website atau sistem Anda selesai di-deploy.' },
    { q: 'Apakah bisa membuat sistem informasi yang kompleks?', a: 'Ya. Kami berpengalaman membangun arsitektur sistem informasi berbasis web seperti sistem administrasi pemerintahan, portal data publik, dan dashboard monitoring dengan integrasi API.' },
  ];

  const contactInfo = [
    { icon: <FiUser size={20} />, title: 'Developer', value: 'M. Bayu Nurdiansyah P.', bg: 'bg-blue-50 text-blue-600', hoverBg: 'group-hover:bg-blue-600 group-hover:text-white' },
    { icon: <FiMapPin size={20} />, title: 'Location', value: 'Bandung • Cianjur • Garut', bg: 'bg-sky-50 text-sky-600', hoverBg: 'group-hover:bg-sky-600 group-hover:text-white' },
    { icon: <FiMail size={20} />, title: 'Email', value: 'muhammadbayunp@gmail.com', href: 'mailto:muhammadbayunp@gmail.com', bg: 'bg-indigo-50 text-indigo-600', hoverBg: 'group-hover:bg-indigo-600 group-hover:text-white' },
    { icon: <FiPhoneCall size={20} />, title: 'WhatsApp', value: '0896-6393-3263', href: 'https://wa.me/6289663933263', bg: 'bg-emerald-50 text-emerald-600', hoverBg: 'group-hover:bg-emerald-500 group-hover:text-white' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[70%] md:w-[50%] h-[65%] bg-gradient-to-bl from-blue-400/20 to-sky-300/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[70%] md:w-[50%] h-[60%] bg-gradient-to-tr from-indigo-400/15 to-violet-300/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="container mx-auto px-5 md:px-8 max-w-4xl relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
              <span className="text-xs font-black text-slate-700 tracking-widest uppercase">Let's Connect</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-[2.8rem] sm:text-6xl md:text-[5.5rem] font-black text-slate-900 mb-5 tracking-tighter leading-[1.04]">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">MBNP</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl font-medium text-slate-600 mb-10 px-2">
              Mari Diskusikan Ide Hebat Anda Hari Ini.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form Bento */}
      <section className="py-12 md:py-20 px-5 md:px-8 relative z-20">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-7 md:gap-10">

          {/* Contact Info Cards */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="lg:col-span-2 space-y-4">
            <motion.h2 variants={fadeUp} className="font-display text-xl md:text-2xl font-black text-slate-900 mb-6">Informasi Kontak</motion.h2>
            {contactInfo.map((item, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="bg-white p-6 md:p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 transition-all group">
                    <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 ${item.hoverBg} transition-all group-hover:scale-110`}>{item.icon}</div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      <p className="text-slate-600 font-medium text-sm mt-0.5 truncate hover:text-blue-600 transition-colors">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white p-6 md:p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center gap-4 transition-all group cursor-default">
                    <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 ${item.hoverBg} transition-all group-hover:scale-110`}>{item.icon}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      <p className="text-slate-600 font-medium text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="lg:col-span-3">
            <div className="bg-white p-7 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <h2 className="font-display text-2xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight relative z-10">Kirim Pesan</h2>
              <p className="text-sm md:text-base text-slate-500 mb-8 font-medium relative z-10">Jelaskan ide atau kebutuhan sistem Anda secara mendetail.</p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Nama Lengkap</label>
                    <input type="text" name="nama" required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all text-sm" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Email Valid</label>
                    <input type="email" name="email" required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all text-sm" placeholder="email@perusahaan.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Nomor WhatsApp</label>
                    <input type="text" name="phone" required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all text-sm" placeholder="08..." />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Jenis Proyek</label>
                    <div className="relative">
                      <select name="layanan" required className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all appearance-none cursor-pointer text-sm">
                        <option value="Website Company Profile">Website Company Profile</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                        <option value="Portal Data">Portal Data</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Estimasi Budget</label>
                  <div className="relative">
                    <select name="budget" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all appearance-none cursor-pointer text-sm">
                      <option value="Belum ditentukan">Pilih range budget</option>
                      <option value="< 5 juta">&lt; 5 Juta</option>
                      <option value="5 - 10 juta">5 – 10 Juta</option>
                      <option value="10 - 20 juta">10 – 20 Juta</option>
                      <option value="> 20 juta">&gt; 20 Juta</option>
                    </select>
                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest">Deskripsi Proyek</label>
                  <textarea name="pesan" required rows={4} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none bg-slate-50 font-medium transition-all resize-none text-sm" placeholder="Ceritakan fitur utama atau masalah yang ingin diselesaikan..."></textarea>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-4 md:py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 transition-all text-base flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Mengirim...' : <><span>Kirim via WhatsApp</span><FiMessageSquare className="text-xl group-hover:scale-110 transition-transform" /></>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-[-5%] left-[30%] w-[400px] h-[400px] bg-gradient-to-br from-sky-50/60 to-blue-50/30 rounded-full blur-[130px] pointer-events-none" />
        <div className="container mx-auto px-5 md:px-8 max-w-5xl relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-12 md:mb-14">
            <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Social Networks</motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Terhubung Lebih Dekat</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { href: 'https://www.linkedin.com/in/mbayunp/', icon: <FiLinkedin size={28} />, label: 'LinkedIn', desc: 'Rekam jejak profesional & histori project.', color: '#0A66C2', hoverBorder: 'hover:border-[#0A66C2]', hoverBg: 'hover:bg-[#0A66C2]/5', iconHover: 'group-hover:bg-[#0A66C2] group-hover:text-white' },
              { href: 'https://www.instagram.com/m.bayunp/', icon: <FiInstagram size={28} />, label: 'Instagram', desc: 'Karya visual & insight dunia digital.', color: '#E1306C', hoverBorder: 'hover:border-[#E1306C]', hoverBg: 'hover:bg-[#E1306C]/5', iconHover: 'group-hover:bg-gradient-to-tr group-hover:from-[#F56040] group-hover:to-[#C13584] group-hover:text-white' },
              { href: 'https://www.facebook.com/bayu.bojongiv', icon: <FiFacebook size={28} />, label: 'Facebook', desc: 'Update terbaru seputar teknologi.', color: '#1877F2', hoverBorder: 'hover:border-[#1877F2]', hoverBg: 'hover:bg-[#1877F2]/5', iconHover: 'group-hover:bg-[#1877F2] group-hover:text-white' },
            ].map((soc, i) => (
              <motion.a key={i} href={soc.href} target="_blank" rel="noopener noreferrer" variants={fadeUp}
                whileHover={{ scale: 1.04, y: -5 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`group p-7 md:p-9 rounded-[2.5rem] bg-slate-50 border border-slate-100 ${soc.hoverBorder} ${soc.hoverBg} transition-all text-center cursor-pointer`}>
                <div className={`w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-all ${soc.iconHover}`} style={{ color: soc.color }}>
                  {soc.icon}
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 mb-2">{soc.label}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{soc.desc}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-gradient-to-bl from-blue-50/60 to-indigo-50/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="container mx-auto px-5 md:px-8 max-w-3xl relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="text-center mb-12 md:mb-14">
            <motion.p variants={fadeUp} className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Pertanyaan Umum</motion.h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeUp}
                className={`bg-white rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${openFaq === index ? 'border-blue-300 shadow-lg shadow-blue-100/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 md:p-6 text-left">
                  <span className={`font-bold text-base pr-4 transition-colors ${openFaq === index ? 'text-blue-600' : 'text-slate-800'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                    <FiChevronDown size={14} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="p-5 md:p-6 pt-0 text-slate-500 font-medium leading-relaxed text-sm border-t border-slate-50">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-36 bg-[#0F172A] text-white text-center relative overflow-hidden">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[400px] bg-blue-700/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-violet-700/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-5 md:px-8 max-w-3xl relative z-10">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
              Masih Ragu? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Mari Mengobrol.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-base md:text-xl mb-12 leading-relaxed font-medium">
              Konsultasi awal gratis! Jangan ragu untuk membicarakan rencana atau kendala sistem yang sedang Anda hadapi.
            </motion.p>
            <motion.div variants={fadeUp}>
              <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-white text-slate-900 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-slate-100 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all w-full sm:w-auto">
                Chat WhatsApp <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;