'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Check, Send, Heart, Music, Clock } from 'lucide-react';
import { TemplateProps } from '../../types';
import CountdownTimer from '../../components/CountdownTimer';
import AudioPlayer from '../../components/AudioPlayer';
import { getAssetUrl } from '../../services/api';

export default function LuxuryTemplate({ data, guestName, onSubmitRSVP, isSubmittingRSVP }: TemplateProps) {
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

  // Luxury Default Palette (Deep Sapphire and Champagne Gold) fallback
  const primaryColor = 'var(--primary-color, #085090)';
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
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-serif">
        {/* Background Parallax image with high blur */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-sm scale-110" style={{ backgroundImage: `url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1507504038482-7621ee28c249?auto=format&fit=crop&q=80&w=1200'}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
        
        {/* Decorative lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sapphire-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-xl mx-auto glass-premium p-8 sm:p-14 rounded-3xl text-gold-100"
        >
          {/* Top Decorative Ornament */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold-500/60" />
            <Heart className="w-4 h-4 text-gold-500 animate-pulse" fill="currentColor" style={{ color: secondaryColor }} />
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <span className="text-[10px] font-bold tracking-[0.5em] uppercase block mb-3 font-sans text-gold-400" style={{ color: secondaryColor }}>
            EXCLUSIVE INVITATION
          </span>

          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold my-6 tracking-widest text-gold-100 uppercase leading-snug">
            {data.title}
          </h1>

          <div className="w-16 h-[1px] mx-auto my-6 bg-gold-500/30" />

          {guestName && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="my-8 py-5 max-w-sm mx-auto rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xs"
            >
              <span className="text-[9px] uppercase tracking-widest text-slate-400 block mb-2 font-sans font-medium">Kepada Yth. Tamu Kehormatan:</span>
              <span className="text-xl font-bold font-sans tracking-wide text-gold-300" style={{ color: secondaryColor }}>{guestName}</span>
            </motion.div>
          )}

          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed mb-8 font-sans">
            Dengan segala hormat, kami mengundang Anda untuk hadir dan menyaksikan penyatuan suci kami.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="group mt-2 px-10 py-4.5 rounded-full border border-gold-500/40 bg-gradient-to-r from-gold-600/10 to-gold-500/20 text-gold-200 font-sans font-bold text-xs tracking-widest transition-premium cursor-pointer uppercase shadow-lg shadow-gold-950/30 hover:border-gold-500 hover:from-gold-500 hover:to-gold-600 hover:text-slate-950 hover:shadow-gold-500/10 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Buka Undangan
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-gold-500/20 selection:text-gold-200 relative overflow-x-hidden">
      {isSectionEnabled('music') && data.musicUrl && <AudioPlayer url={data.musicUrl} />}

      {/* Hero Section */}
      {isSectionEnabled('hero') && (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, rgba(2, 11, 24, 0.95), rgba(2, 11, 24, 0.98)), url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1507504038482-7621ee28c249?auto=format&fit=crop&q=80&w=1200'}')` }}>
          {/* Subtle Radial Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sapphire-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl z-10"
          >
            <motion.span variants={itemVariants} className="text-[10px] font-bold tracking-[0.4em] uppercase block mb-4 text-gold-400" style={{ color: secondaryColor }}>
              THE CELEBRATION OF HOLY MATRIMONY
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-7xl font-cinzel font-bold mb-6 tracking-widest text-gold-100 uppercase drop-shadow-md">
              {data.title}
            </motion.h2>

            <motion.div variants={itemVariants} className="w-16 h-[1px] bg-gold-500/30 mx-auto my-6" />
            
            {isSectionEnabled('countdown') && (
              <motion.div variants={itemVariants} className="my-8">
                <CountdownTimer targetDate={data.weddingDate} themeColor="var(--secondary-color, #d4af37)" glassMode="premium" />
              </motion.div>
            )}

            <motion.p variants={itemVariants} className="text-slate-400 font-cormorant text-xl italic max-w-lg mx-auto leading-relaxed px-4 my-8">
              "{data.welcomeText}"
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex justify-center mt-8">
              <div className="animate-bounce p-2 rounded-full border border-gold-500/20 text-gold-400/60">
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
        <section className="py-28 px-4 max-w-4xl mx-auto relative">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-sapphire-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-20 relative z-10">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>OUR CHRONOLOGY</span>
            <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Kisah Cinta Kami</h3>
            <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4" />
          </div>

          <div className="relative border-l border-gold-500/20 ml-4 sm:ml-32 z-10">
            {data.stories.map((story, index) => (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                key={story.id}
                className="mb-16 ml-8 relative"
              >
                <div 
                  className="absolute -left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-950 shadow-md flex items-center justify-center" 
                  style={{ backgroundColor: secondaryColor }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>
                
                <span className="text-[10px] font-bold tracking-widest font-mono uppercase text-gold-400" style={{ color: secondaryColor }}>
                  {new Date(story.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                
                <h4 className="text-xl font-cinzel font-semibold text-gold-100 mt-2">{story.title}</h4>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-xl font-sans">{story.content}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Wedding Info (Date & Location) */}
      {isSectionEnabled('maps') && (
        <section className="py-28 bg-slate-900/40 px-4 text-center border-t border-b border-white/5 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507504038482-7621ee28c249?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 filter blur-sm pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>THE CELEBRATION DETAILS</span>
              <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Waktu & Tempat Acara</h3>
              <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4" />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-premium p-10 rounded-2xl flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="text-gold-400" size={24} style={{ color: secondaryColor }} />
                </div>
                <h4 className="text-xl font-cinzel font-bold mb-3 text-gold-100">Resepsi Pernikahan</h4>
                <p className="text-sm text-slate-300 font-serif">
                  {new Date(data.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="w-8 h-[1px] bg-gold-500/20 my-4" />
                <p className="text-xs text-gold-400 font-mono">
                  Pukul {new Date(data.weddingDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB - Selesai
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="glass-premium p-10 rounded-2xl flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="text-gold-400" size={24} style={{ color: secondaryColor }} />
                </div>
                <h4 className="text-xl font-cinzel font-bold mb-3 text-gold-100">Lokasi Acara</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-serif max-w-xs">
                  {data.address}
                </p>
                {data.mapUrl && (
                  <a
                    href={data.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-gold-400 tracking-widest uppercase transition-all duration-300 border-b border-gold-500/20 hover:border-gold-500 hover:text-gold-300 pb-1"
                    style={{ color: secondaryColor }}
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
        <section className="py-28 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>OUR LOOKBOOK</span>
            <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Galeri Kebahagiaan</h3>
            <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.galleries.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                key={item.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-2xl border border-white/5 bg-slate-900"
              >
                <img
                  src={getAssetUrl(item.imageUrl)}
                  alt={item.caption || 'Gallery photo'}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-all duration-1000 filter brightness-90 group-hover:brightness-100"
                />
                
                {/* Gold Frame Border Overlay */}
                <div className="absolute inset-4 border border-gold-500/10 group-hover:border-gold-500/30 transition-colors duration-500 pointer-events-none rounded-xl" />

                {item.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-gold-200 text-xs sm:text-sm font-semibold tracking-wider font-serif">{item.caption}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {isSectionEnabled('rsvp') && (
        <section className="py-28 bg-slate-900/20 px-4 border-t border-white/5">
          <div className="max-w-xl mx-auto glass-premium p-8 sm:p-14 rounded-3xl relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sapphire-500/5 rounded-full blur-2xl" />

            <div className="text-center mb-10 relative z-10">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>R.S.V.P REGISTRY</span>
              <h3 className="text-3xl font-cinzel font-semibold mb-2 text-gold-100">Konfirmasi Kehadiran</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed mt-2 font-sans">
                Kehadiran Anda adalah suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami.
              </p>
            </div>

            {rsvpSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 relative z-10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-6">
                  <Check size={28} />
                </div>
                <h4 className="text-2xl font-cinzel font-bold text-gold-200">Terima Kasih</h4>
                <p className="text-sm text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">Respon konfirmasi Anda telah sukses terdaftar dalam buku tamu pernikahan kami.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-sans">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan Nama Lengkap Anda"
                    className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl shadow-inner font-sans"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Konfirmasi Kehadiran</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setAttendance(true); setGuestCount(1); }}
                      className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border rounded-xl cursor-pointer ${
                        attendance
                          ? 'text-slate-950 border-transparent font-extrabold shadow-lg shadow-gold-500/10'
                          : 'bg-transparent border-white/10 text-slate-400 hover:border-gold-500/30'
                      }`}
                      style={attendance ? { backgroundColor: secondaryColor } : {}}
                    >
                      Hadir dengan Senang Hati
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAttendance(false); setGuestCount(0); }}
                      className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border rounded-xl cursor-pointer ${
                        !attendance
                          ? 'text-slate-950 border-transparent font-extrabold shadow-lg shadow-gold-500/10'
                          : 'bg-transparent border-white/10 text-slate-400 hover:border-gold-500/30'
                      }`}
                      style={!attendance ? { backgroundColor: secondaryColor } : {}}
                    >
                      Mohon Maaf, Berhalangan
                    </button>
                  </div>
                </div>

                {attendance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Jumlah Tamu</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-slate-950 text-slate-200">
                          {num} {num === 1 ? 'Orang Tamu' : 'Orang Tamu'}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Ucapan Selamat & Doa Restu</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat & doa restu Anda kepada kedua mempelai..."
                    rows={4}
                    className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRSVP}
                  className="w-full py-4.5 mt-4 font-bold text-xs tracking-widest uppercase transition-premium flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-500/5 hover:scale-[1.01] rounded-xl text-slate-950 hover:shadow-gold-500/10"
                  style={{ backgroundColor: secondaryColor }}
                >
                  {isSubmittingRSVP ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Kirim Konfirmasi Kehadiran</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 bg-slate-950 text-slate-500 text-center text-xs px-4 border-t border-white/5 relative overflow-hidden">
        {/* Background design ornaments */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h4 className="font-cinzel text-xl font-bold mb-3 tracking-widest text-gold-100" style={{ color: secondaryColor }}>{data.title}</h4>
          <p className="max-w-xs mx-auto leading-relaxed mb-6">Merupakan kehormatan bagi kami jika Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.</p>
          <div className="w-16 h-[1px] bg-gold-500/20 mx-auto mb-6" />
          <p className="text-[9px] uppercase tracking-[0.4em] text-gold-400" style={{ color: secondaryColor }}>MBNP Luxury Series</p>
        </div>
      </footer>
    </div>
  );
}
