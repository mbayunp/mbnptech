'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Check, Send } from 'lucide-react';
import { TemplateProps } from '../../types';
import CountdownTimer from '../../components/CountdownTimer';
import AudioPlayer from '../../components/AudioPlayer';
import { getAssetUrl } from '../../services/api';

export default function MinimalTemplate({ data, guestName, onSubmitRSVP, isSubmittingRSVP }: TemplateProps) {
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

  // Minimal default color: clean dark slate and subtle warm gray
  const primaryColor = 'var(--primary-color, #171717)';
  const secondaryColor = 'var(--secondary-color, #737373)';

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  // Child animation items
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        ease: [0.16, 1, 0.3, 1],
        duration: 0.8
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100 via-white to-neutral-50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-lg w-full mx-auto p-10 sm:p-14 border border-neutral-200 bg-white shadow-md rounded-none text-neutral-800"
        >
          <span className="text-[9px] font-bold tracking-[0.4em] text-neutral-400 uppercase block mb-4">
            INVITATION
          </span>
          <div className="w-6 h-[1px] bg-neutral-300 mx-auto my-4" />
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 my-6 tracking-tight uppercase leading-tight font-serif">
            {data.title}
          </h1>
          <div className="w-6 h-[1px] bg-neutral-300 mx-auto my-4" />

          {guestName && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-6 py-4 border-t border-b border-neutral-100 max-w-xs mx-auto"
            >
              <span className="text-[8px] uppercase tracking-widest text-neutral-400 block mb-1">Prepared For:</span>
              <span className="text-md font-medium text-neutral-850 tracking-tight font-sans block mt-1">{guestName}</span>
            </motion.div>
          )}

          <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed mb-8">
            Please join us in celebrating our marriage ceremony.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="mt-2 px-10 py-4 text-white font-sans font-semibold text-xs tracking-widest transition-all duration-300 cursor-pointer uppercase rounded-none border border-transparent hover:bg-neutral-800 shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Enter Invitation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans selection:bg-neutral-100 selection:text-neutral-900 relative overflow-x-hidden">
      {isSectionEnabled('music') && data.musicUrl && <AudioPlayer url={data.musicUrl} />}

      {/* Hero Section */}
      {isSectionEnabled('hero') && (
        <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center p-6 bg-neutral-50/50 border-b border-neutral-100 overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-2xl z-10"
          >
            <motion.span variants={itemVariants} className="text-[9px] font-bold tracking-[0.4em] uppercase block mb-4 text-neutral-400" style={{ color: secondaryColor }}>
              THE WEDDING CELEBRATION
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-6xl font-light text-neutral-900 mb-8 uppercase tracking-tight font-serif">
              {data.title}
            </motion.h2>

            <motion.div variants={itemVariants} className="w-10 h-[1px] bg-neutral-300 mx-auto my-6" />
            
            {isSectionEnabled('countdown') && (
              <motion.div variants={itemVariants} className="my-8">
                <CountdownTimer targetDate={data.weddingDate} themeColor="var(--primary-color, #171717)" textColor="text-neutral-450" glassMode="light" />
              </motion.div>
            )}

            <motion.p variants={itemVariants} className="text-neutral-500 font-light text-sm sm:text-base max-w-md mx-auto leading-relaxed px-4 my-8 font-sans">
              "{data.welcomeText}"
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center mt-6">
              <div className="animate-bounce p-1.5 rounded-full border border-neutral-200 text-neutral-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Story Timeline */}
      {isSectionEnabled('story') && data.stories && data.stories.length > 0 && (
        <section className="py-24 px-6 max-w-4xl mx-auto relative">
          <div className="text-center mb-20">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2" style={{ color: secondaryColor }}>OUR TIMELINE</span>
            <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 uppercase tracking-widest font-serif">Our Journey</h3>
            <div className="w-10 h-[1px] bg-neutral-300 mx-auto mt-4" />
          </div>

          <div className="relative border-l border-neutral-200 ml-4 sm:ml-32">
            {data.stories.map((story, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                key={story.id}
                className="mb-14 ml-8 relative"
              >
                <div 
                  className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center" 
                  style={{ backgroundColor: primaryColor }}
                />
                
                <span className="text-[9px] font-bold tracking-wider font-mono text-neutral-400">
                  {new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </span>
                
                <h4 className="text-md font-semibold text-neutral-900 mt-2 uppercase tracking-tight font-sans">{story.title}</h4>
                <p className="text-neutral-500 text-xs sm:text-sm mt-2 leading-relaxed max-w-xl font-light font-sans">{story.content}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Wedding Info (Date & Location) */}
      {isSectionEnabled('maps') && (
        <section className="py-24 bg-neutral-50/50 px-6 text-center border-t border-b border-neutral-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2" style={{ color: secondaryColor }}>DETAILS</span>
              <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 uppercase tracking-widest font-serif">When & Where</h3>
              <div className="w-10 h-[1px] bg-neutral-300 mx-auto mt-4" />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 sm:p-10 border border-neutral-200 flex flex-col items-center group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                  <Calendar className="text-neutral-600" size={20} style={{ color: primaryColor }} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-neutral-900">The Schedule</h4>
                <p className="text-xs text-neutral-800 font-medium font-serif">
                  {new Date(data.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="w-6 h-[1px] bg-neutral-200 my-3" />
                <p className="text-xs text-neutral-400 font-mono">
                  Pukul {new Date(data.weddingDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white p-8 sm:p-10 border border-neutral-200 flex flex-col items-center group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                  <MapPin className="text-neutral-600" size={20} style={{ color: primaryColor }} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-neutral-900">The Venue</h4>
                <p className="text-xs text-neutral-800 leading-relaxed font-serif max-w-xs">
                  {data.address}
                </p>
                {data.mapUrl && (
                  <a
                    href={data.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center text-[10px] font-bold text-neutral-800 tracking-widest uppercase hover:underline pb-0.5"
                    style={{ color: primaryColor }}
                  >
                    View on Maps
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {isSectionEnabled('gallery') && data.galleries && data.galleries.length > 0 && (
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2" style={{ color: secondaryColor }}>LOOKBOOK</span>
            <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 uppercase tracking-widest font-serif">The Gallery</h3>
            <div className="w-10 h-[1px] bg-neutral-300 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.galleries.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                key={item.id}
                className="relative aspect-square overflow-hidden group border border-neutral-100 bg-neutral-100"
              >
                <img
                  src={getAssetUrl(item.imageUrl)}
                  alt={item.caption || 'Gallery photo'}
                  className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-all duration-700 filter grayscale hover:grayscale-0"
                />
                
                {item.caption && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-[9px] uppercase tracking-wider font-semibold font-sans">{item.caption}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {isSectionEnabled('rsvp') && (
        <section className="py-24 bg-neutral-50/50 px-6 border-t border-neutral-100">
          <div className="max-w-md mx-auto p-8 sm:p-10 border border-neutral-200 bg-white">
            <div className="text-center mb-10">
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2">REGISTRATION</span>
              <h3 className="text-2xl font-light text-neutral-900 uppercase tracking-widest font-serif">Confirm RSVP</h3>
              <p className="text-[9px] text-neutral-400 mt-2 font-mono">YOUR ATTENDANCE HELPS OUR PLANNING</p>
            </div>

            {rsvpSent ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-55 text-neutral-900 border border-neutral-200 mb-4">
                  <Check size={20} />
                </div>
                <h4 className="text-xs font-bold uppercase text-neutral-900 tracking-wider">Attendance Complete</h4>
                <p className="text-xs text-neutral-500 mt-2">Thank you, your reply has been logged successfully.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div>
                  <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter guest name"
                    className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs transition-all rounded-none bg-neutral-50/50 text-neutral-800"
                  />
                </div>

                <div>
                  <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Attendance</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setAttendance(true); setGuestCount(1); }}
                      className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border rounded-none cursor-pointer ${
                        attendance
                          ? 'text-white border-transparent'
                          : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                      }`}
                      style={attendance ? { backgroundColor: primaryColor } : {}}
                    >
                      Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAttendance(false); setGuestCount(0); }}
                      className={`py-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border rounded-none cursor-pointer ${
                        !attendance
                          ? 'text-white border-transparent'
                          : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                      }`}
                      style={!attendance ? { backgroundColor: primaryColor } : {}}
                    >
                      Decline
                    </button>
                  </div>
                </div>

                {attendance && (
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Party Size</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs transition-all rounded-none bg-neutral-50/50"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a warm greeting..."
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs transition-all rounded-none bg-neutral-50/50 text-neutral-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRSVP}
                  className="w-full py-3.5 mt-2 text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-none border border-transparent"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmittingRSVP ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={10} />
                      <span>Send RSVP</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 bg-white text-neutral-400 text-center text-xs px-6 border-t border-neutral-100 relative">
        <div className="max-w-md mx-auto">
          <h4 className="text-sm font-light text-neutral-950 uppercase tracking-widest mb-2 font-serif">{data.title}</h4>
          <p className="mb-4 text-[11px] leading-relaxed">Thank you for sharing in our joy and supporting us as we embark on this new chapter together.</p>
          <div className="w-6 h-[1px] bg-neutral-200 mx-auto my-4" />
          <p className="text-[9px] font-mono text-neutral-300 uppercase tracking-widest">MBNP Minimalist Series</p>
        </div>
      </footer>
    </div>
  );
}
