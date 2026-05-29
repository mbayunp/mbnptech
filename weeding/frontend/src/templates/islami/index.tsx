'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Check, Send, Heart } from 'lucide-react';
import { TemplateProps } from '../../types';
import CountdownTimer from '../../components/CountdownTimer';
import AudioPlayer from '../../components/AudioPlayer';
import { getAssetUrl } from '../../services/api';

export default function IslamiTemplate({ data, guestName, onSubmitRSVP, isSubmittingRSVP }: TemplateProps) {
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

  // Islami default colors: deep emerald and golden yellow
  const primaryColor = 'var(--primary-color, #064e3b)';
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
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-serif">
        {/* Background Parallax Image with soft dark green overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xs scale-105" style={{ backgroundImage: `url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1200'}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/90 to-emerald-950" />
        
        {/* Decorative Arabesque glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-xl mx-auto glass-dark p-8 sm:p-14 rounded-[2.5rem] border border-gold-500/20 shadow-2xl text-amber-100 bg-emerald-950/80"
        >
          {/* Top Calligraphy ornament */}
          <div className="mb-4">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase block mb-3 text-gold-500" style={{ color: secondaryColor }}>
              WALIMATUL URSY
            </span>
            <div className="text-xl sm:text-2xl font-semibold tracking-wide text-gold-300 font-cinzel my-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="w-16 h-[1px] bg-gold-500/30 mx-auto my-3" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold my-5 tracking-widest text-gold-100 uppercase leading-snug">
            {data.title}
          </h1>

          <div className="w-16 h-[1px] bg-gold-500/30 mx-auto my-5" />

          {guestName && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="my-8 border-t border-b border-gold-500/20 py-5 max-w-xs mx-auto font-sans"
            >
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 block mb-1 font-medium">Turut Mengundang Bapak/Ibu/Saudara/i:</span>
              <span className="text-xl font-bold text-gold-200 block mt-1">{guestName}</span>
            </motion.div>
          )}

          <p className="text-xs text-emerald-200/60 max-w-xs mx-auto leading-relaxed mb-8 font-sans">
            Dengan mengharapkan rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="mt-2 px-10 py-4.5 rounded-full text-slate-950 font-sans font-bold text-xs tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] transition-premium cursor-pointer uppercase border border-transparent"
            style={{ backgroundColor: secondaryColor }}
          >
            Buka Undangan
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 font-sans selection:bg-gold-500/20 selection:text-gold-200 relative overflow-x-hidden">
      {isSectionEnabled('music') && data.musicUrl && <AudioPlayer url={data.musicUrl} />}

      {/* Hero Section */}
      {isSectionEnabled('hero') && (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, rgba(2, 44, 34, 0.95), rgba(2, 44, 34, 0.98)), url('${getAssetUrl(data.coverImage) || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=1200'}')` }}>
          {/* Subtle Arabesque Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl z-10"
          >
            <motion.span variants={itemVariants} className="text-xs font-semibold tracking-[0.3em] uppercase block mb-4 text-emerald-300" style={{ color: secondaryColor }}>
              Maha Suci Allah yang menciptakan makhluk-Nya berpasang-pasangan
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

            <motion.div 
              variants={itemVariants} 
              className="bg-emerald-900/40 p-8 rounded-3xl border border-gold-500/10 max-w-xl mx-auto my-8 shadow-xl backdrop-blur-xs relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold-500/5 rounded-full blur-xl" />
              <p className="font-semibold text-gold-400 mb-3 font-serif text-sm tracking-widest uppercase">QS. Ar-Rum: 21</p>
              <p className="text-emerald-200/90 text-sm leading-relaxed italic font-serif">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
              </p>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Greeting and Welcome Text */}
      <section className="py-24 px-4 max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-gold-400 text-lg mb-4 tracking-widest uppercase" style={{ color: secondaryColor }}>Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <div className="w-12 h-[1px] bg-gold-500/20 mx-auto my-4" />
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-serif italic my-6 px-4">
            {data.welcomeText}
          </p>
        </motion.div>
      </section>

      {/* Story Timeline */}
      {isSectionEnabled('story') && data.stories && data.stories.length > 0 && (
        <section className="py-24 px-4 max-w-4xl mx-auto relative">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-20 relative z-10">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>PERJALANAN CINTA</span>
            <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Kisah Cinta Kami</h3>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4" />
          </div>

          <div className="relative border-l border-gold-500/20 ml-4 sm:ml-32 z-10">
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
                  className="absolute -left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-950 shadow-md flex items-center justify-center" 
                  style={{ backgroundColor: secondaryColor }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>
                
                <span className="text-[10px] font-bold tracking-widest font-mono uppercase text-gold-400" style={{ color: secondaryColor }}>
                  {new Date(story.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                
                <h4 className="text-xl font-cinzel font-semibold text-gold-100 mt-2">{story.title}</h4>
                <p className="text-emerald-200/80 text-sm mt-3 leading-relaxed max-w-xl font-sans">{story.content}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Wedding Info (Date & Location) */}
      {isSectionEnabled('maps') && (
        <section className="py-28 bg-emerald-950/40 px-4 text-center border-t border-b border-gold-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 filter blur-sm pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>WALIMATUL URSY DETAILS</span>
              <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Waktu & Tempat Acara</h3>
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent my-4" />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-dark p-10 rounded-[2.5rem] border border-gold-500/10 flex flex-col items-center group bg-emerald-950/80"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="text-gold-400" size={24} style={{ color: secondaryColor }} />
                </div>
                <h4 className="text-xl font-cinzel font-bold mb-3 text-gold-100">Akad & Resepsi</h4>
                <p className="text-sm text-emerald-250 font-serif">
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
                className="glass-dark p-10 rounded-[2.5rem] border border-gold-500/10 flex flex-col items-center group bg-emerald-950/80"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="text-gold-400" size={24} style={{ color: secondaryColor }} />
                </div>
                <h4 className="text-xl font-cinzel font-bold mb-3 text-gold-100">Lokasi Acara</h4>
                <p className="text-sm text-emerald-250 leading-relaxed font-serif max-w-xs">
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
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>GALLERY DOKUMENTASI</span>
            <h3 className="text-3xl sm:text-4xl font-cinzel font-semibold mb-2 text-gold-100">Galeri Foto Kebahagiaan</h3>
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
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-2xl border border-gold-500/10 bg-slate-900"
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
        <section className="py-28 bg-emerald-950/20 px-4 border-t border-gold-500/10">
          <div className="max-w-xl mx-auto glass-premium p-8 sm:p-14 rounded-3xl relative overflow-hidden bg-emerald-950/80 border-gold-500/10">
            {/* Background design accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />

            <div className="text-center mb-10 relative z-10">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-gold-400 block mb-2" style={{ color: secondaryColor }}>R.S.V.P KEHADIRAN</span>
              <h3 className="text-3xl font-cinzel font-semibold mb-2 text-gold-100 font-serif">Konfirmasi Kehadiran</h3>
              <p className="text-xs text-emerald-200/60 max-w-xs mx-auto leading-relaxed mt-2 font-sans">
                Merupakan kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.
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
                <h4 className="text-2xl font-cinzel font-bold text-gold-200">Jazakumullah Khairan</h4>
                <p className="text-sm text-emerald-250 mt-3 max-w-xs mx-auto leading-relaxed">Konfirmasi kehadiran Anda telah tercatat dengan aman di database tamu kami.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-sans">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full px-5 py-4 bg-emerald-950/90 border border-gold-500/10 text-slate-200 placeholder:text-emerald-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl shadow-inner font-sans"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Kehadiran</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setAttendance(true); setGuestCount(1); }}
                      className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border rounded-xl cursor-pointer ${
                        attendance
                          ? 'text-slate-950 border-transparent font-extrabold shadow-lg shadow-gold-500/10'
                          : 'bg-transparent border-gold-500/10 text-emerald-200 hover:border-gold-500/30'
                      }`}
                      style={attendance ? { backgroundColor: secondaryColor } : {}}
                    >
                      Insya Allah Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAttendance(false); setGuestCount(0); }}
                      className={`py-4 px-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border rounded-xl cursor-pointer ${
                        !attendance
                          ? 'text-slate-950 border-transparent font-extrabold shadow-lg shadow-gold-500/10'
                          : 'bg-transparent border-gold-500/10 text-emerald-200 hover:border-gold-500/30'
                      }`}
                      style={!attendance ? { backgroundColor: secondaryColor } : {}}
                    >
                      Maaf, Berhalangan Hadir
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
                      className="w-full px-5 py-4 bg-emerald-950/90 border border-gold-500/10 text-slate-200 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-emerald-950 text-slate-200">
                          {num} Orang
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 text-gold-400" style={{ color: secondaryColor }}>Doa Restu & Ucapan</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat & doa restu Anda kepada kedua mempelai..."
                    rows={4}
                    className="w-full px-5 py-4 bg-emerald-950/90 border border-gold-500/10 text-slate-200 placeholder:text-emerald-800 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 text-sm transition-all rounded-xl font-sans"
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
      <footer className="py-20 bg-emerald-950 text-emerald-450 text-center text-xs px-4 border-t border-gold-500/10 relative overflow-hidden">
        {/* Background design ornaments */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h4 className="font-cinzel text-xl font-bold mb-3 tracking-widest text-gold-100" style={{ color: secondaryColor }}>{data.title}</h4>
          <p className="mb-4">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
          <div className="w-16 h-[1px] bg-gold-500/20 mx-auto mb-6" />
          <p className="text-[9px] uppercase tracking-[0.4em] text-gold-450" style={{ color: secondaryColor }}>MBNP Islami Series</p>
        </div>
      </footer>
    </div>
  );
}
