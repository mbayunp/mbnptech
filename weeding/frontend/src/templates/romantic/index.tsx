'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Check, Send, Heart } from 'lucide-react';
import { TemplateProps } from '../../types';
import CountdownTimer from '../../components/CountdownTimer';
import AudioPlayer from '../../components/AudioPlayer';
import { getAssetUrl } from '../../services/api';

export default function RomanticTemplate({ data, guestName, onSubmitRSVP, isSubmittingRSVP }: TemplateProps) {
  const [name, setName] = useState(guestName || '');
  const [attendance, setAttendance] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [rsvpSent, setRsvpSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmitRSVP({ name, attendance, guestCount, message });
    setRsvpSent(true);
  };

  const isSectionEnabled = (sectionName: string): boolean => {
    if (!data.sections) return true;
    return data.sections.find((s: any) => s.sectionName === sectionName)?.isEnabled !== false;
  };

  // Romantic default colors: warm rose / blush pink and champagne gold
  const primaryColor = 'var(--primary-color, #e07a5f)';
  const secondaryColor = 'var(--secondary-color, #d4af37)';

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  // Child animation items
  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-serif">
        {/* Background Image Parallax with soft warm overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xs scale-105" style={{ backgroundImage: `url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200'}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-100/90 via-rose-50/70 to-rose-100/90" />
        
        {/* Delicate floating shapes */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-xl mx-auto glass p-8 sm:p-14 rounded-[3rem] border border-rose-200/60 shadow-2xl bg-white/70 text-slate-800"
        >
          {/* Top Decorative heart */}
          <div className="flex justify-center items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-200/50 animate-pulse" style={{ color: primaryColor }} />
          </div>

          <span className="text-xs font-semibold tracking-[0.25em] uppercase block mb-3 text-slate-500 font-sans">
            UNDANGAN PERNIKAHAN
          </span>

          <h1 className="text-4xl sm:text-6xl font-alexBrush my-5 tracking-wide text-rose-900 leading-tight" style={{ color: primaryColor }}>
            {data.title}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mt-4 mb-6 font-sans">
            Kami mengundang Anda untuk ikut merayakan penyatuan cinta kasih kami di hari bahagia yang istimewa ini.
          </p>

          {guestName && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 border-t border-b border-rose-200/60 py-5 max-w-xs mx-auto font-sans"
            >
              <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1 font-medium">Kepada Yth. Bapak/Ibu/Saudara/i:</span>
              <span className="text-xl font-extrabold text-rose-950 block mt-1">{guestName}</span>
            </motion.div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 px-10 py-4 rounded-full text-white font-sans font-bold text-xs tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.03] transition-premium cursor-pointer uppercase"
            style={{ backgroundColor: primaryColor }}
          >
            Buka Undangan
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/20 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-700 relative overflow-x-hidden">
      {isSectionEnabled('music') && data.musicUrl && <AudioPlayer url={data.musicUrl} />}

      {/* Hero Section */}
      {isSectionEnabled('hero') && (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, rgba(253, 244, 245, 0.85), rgba(253, 244, 245, 0.95)), url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}')` }}>
          {/* Subtle Pink Mesh Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-200/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-2xl z-10"
          >
            <motion.span variants={itemVariants} className="text-xs font-semibold tracking-[0.3em] uppercase block mb-4 text-slate-500" style={{ color: secondaryColor }}>
              THE WEDDING OF
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="text-5xl sm:text-8xl font-alexBrush mb-8 text-rose-900" style={{ color: primaryColor }}>
              {data.title}
            </motion.h2>
            
            {isSectionEnabled('countdown') && (
              <motion.div variants={itemVariants} className="my-8">
                <CountdownTimer targetDate={data.weddingDate} themeColor="var(--primary-color, #e07a5f)" textColor="text-slate-500" glassMode="light" />
              </motion.div>
            )}

            <motion.p variants={itemVariants} className="text-slate-600 italic font-serif text-lg sm:text-xl max-w-md mx-auto leading-relaxed px-4 my-8">
              "{data.welcomeText}"
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center mt-8">
              <div className="animate-bounce p-2 rounded-full border border-rose-200 text-rose-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Story Timeline */}
      {isSectionEnabled('story') && data.stories && data.stories.length > 0 && (
        <section className="py-24 px-4 max-w-4xl mx-auto relative">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-100/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-20">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400 block mb-2" style={{ color: secondaryColor }}>Kisah Indah Kami</span>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold mb-2 text-rose-950">Lentera Cinta</h3>
            <div className="w-16 h-0.5 mx-auto bg-rose-200 mt-3" style={{ backgroundColor: secondaryColor }} />
          </div>

          <div className="relative border-l border-rose-200 ml-4 sm:ml-32">
            {data.stories.map((story, index) => (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                key={story.id}
                className="mb-14 ml-8 relative"
              >
                <div 
                  className="absolute -left-[40px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center" 
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                
                <span className="text-xs font-bold tracking-wider font-mono text-rose-400" style={{ color: secondaryColor }}>
                  {new Date(story.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                
                <h4 className="text-xl font-serif font-semibold text-rose-950 mt-1">{story.title}</h4>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-xl font-sans">{story.content}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Wedding Info (Date & Location) */}
      {isSectionEnabled('maps') && (
        <section className="py-24 bg-rose-100/30 px-4 text-center border-t border-b border-rose-100/50 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 filter blur-xs pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400 block mb-2" style={{ color: secondaryColor }}>UNDANGAN ACARA</span>
              <h3 className="text-3xl sm:text-4xl font-serif font-semibold mb-2 text-rose-950">Waktu & Tempat Acara</h3>
              <div className="w-16 h-0.5 mx-auto bg-rose-200 mt-3" style={{ backgroundColor: secondaryColor }} />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-rose-100/60 shadow-lg shadow-rose-950/5 flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="text-rose-500" size={24} style={{ color: primaryColor }} />
                </div>
                <h4 className="text-xl font-serif font-semibold text-rose-950 mb-3">Hari Bahagia</h4>
                <p className="text-sm text-slate-700 font-medium font-serif">
                  {new Date(data.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="w-8 h-[1px] bg-rose-200/50 my-3" />
                <p className="text-xs text-slate-500">
                  Pukul {new Date(data.weddingDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB - Selesai
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-rose-100/60 shadow-lg shadow-rose-950/5 flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-rose-100/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="text-rose-500" size={24} style={{ color: primaryColor }} />
                </div>
                <h4 className="text-xl font-serif font-semibold text-rose-950 mb-3">Lokasi Pernikahan</h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed font-serif max-w-xs">
                  {data.address}
                </p>
                {data.mapUrl && (
                  <a
                    href={data.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-rose-600 transition-colors border-b border-rose-200 pb-0.5 hover:text-rose-800 hover:border-rose-400"
                    style={{ color: primaryColor }}
                  >
                    Buka Google Maps
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {isSectionEnabled('gallery') && data.galleries && data.galleries.length > 0 && (
        <section className="py-24 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400 block mb-2" style={{ color: secondaryColor }}>DOKUMENTASI FOTO</span>
            <h3 className="text-3xl sm:text-4xl font-serif font-semibold mb-2 text-rose-950 font-serif">Lembaran Memori</h3>
            <div className="w-16 h-0.5 mx-auto bg-rose-200 mt-3" style={{ backgroundColor: secondaryColor }} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.galleries.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                key={item.id}
                className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-lg border border-rose-100 bg-white"
              >
                <img
                  src={getAssetUrl(item.imageUrl)}
                  alt={item.caption || 'Gallery photo'}
                  className="object-cover w-full h-full transform group-hover:scale-103 transition-all duration-700"
                />
                
                {/* Gold Frame Border Overlay */}
                <div className="absolute inset-3 border border-white/30 group-hover:border-rose-300/30 transition-colors duration-500 pointer-events-none rounded-[1.5rem]" />

                {item.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-xs sm:text-sm font-medium tracking-wide">{item.caption}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {isSectionEnabled('rsvp') && (
        <section className="py-24 bg-rose-50/40 px-4 border-t border-rose-100/50">
          <div className="max-w-xl mx-auto glass p-8 sm:p-14 rounded-[3rem] border border-rose-200/60 shadow-xl bg-white/70 relative overflow-hidden">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400 block mb-2" style={{ color: secondaryColor }}>KONFIRMASI RSVP</span>
              <h3 className="text-3xl font-serif font-semibold mb-2 text-rose-950">Konfirmasi Kehadiran</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mt-2 font-sans">
                Kirimkan konfirmasi kehadiran Anda melalui form di bawah ini agar kami dapat mempersiapkan kehadiran Anda dengan baik.
              </p>
            </div>

            {rsvpSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 relative z-10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5">
                  <Check size={26} />
                </div>
                <h4 className="text-2xl font-serif font-semibold text-slate-800">Terima Kasih!</h4>
                <p className="text-sm text-slate-500 mt-2">Konfirmasi Anda telah sukses dikirimkan dan tercatat di buku tamu kami.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan Nama Lengkap Anda"
                    className="w-full px-5 py-3.5 rounded-2xl border border-rose-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-sm transition-all text-slate-800 font-sans shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Kehadiran</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setAttendance(true); setGuestCount(1); }}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        attendance
                          ? 'text-white shadow-md border-transparent font-bold'
                          : 'bg-white/80 border-rose-100 text-slate-600 hover:bg-white'
                      }`}
                      style={attendance ? { backgroundColor: primaryColor } : {}}
                    >
                      Dapat Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAttendance(false); setGuestCount(0); }}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        !attendance
                          ? 'text-white shadow-md border-transparent font-bold'
                          : 'bg-white/80 border-rose-100 text-slate-600 hover:bg-white'
                      }`}
                      style={!attendance ? { backgroundColor: primaryColor } : {}}
                    >
                      Berhalangan Hadir
                    </button>
                  </div>
                </div>

                {attendance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Jumlah Tamu</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-5 py-3.5 rounded-2xl border border-rose-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-sm transition-all text-slate-800"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Orang
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Ucapan Selamat & Doa Restu</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat & doa restu Anda..."
                    rows={4}
                    className="w-full px-5 py-3.5 rounded-2xl border border-rose-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white text-sm transition-all text-slate-800 font-sans shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRSVP}
                  className="w-full py-4 mt-2 rounded-2xl text-white font-medium text-xs tracking-widest shadow-md hover:shadow hover:scale-[1.01] transition-premium flex items-center justify-center gap-2 cursor-pointer uppercase font-sans"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmittingRSVP ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Kirim Undangan</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 bg-rose-950 text-rose-200/80 text-center text-xs px-4 border-t border-rose-900 relative">
        <div className="relative z-10">
          <h4 className="font-alexBrush text-3xl text-white mb-2">{data.title}</h4>
          <p className="max-w-xs mx-auto leading-relaxed mb-6 font-serif">Suatu kehormatan yang mendalam bagi kami jika Anda berkenan hadir untuk mendoakan restu bagi pernikahan kami.</p>
          <div className="w-12 h-px bg-rose-700 mx-auto mb-6" />
          <p className="text-[10px] text-rose-400 uppercase tracking-widest">Powered by MBNP Invite</p>
        </div>
      </footer>
    </div>
  );
}
