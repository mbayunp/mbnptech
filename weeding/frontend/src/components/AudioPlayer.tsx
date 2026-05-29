'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, VolumeX, Volume2 } from 'lucide-react';
import { getAssetUrl } from '../services/api';

interface AudioPlayerProps {
  url: string;
}

export default function AudioPlayer({ url }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(getAssetUrl(url));
    audio.loop = true;
    audioRef.current = audio;

    // Try playing automatically (often blocked by browser autoplay policies)
    const playAudio = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log('Autoplay blocked. User interaction required.'));
    };

    // Attempt play on first user interaction
    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('touchstart', playAudio, { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Small floating playing message */}
      <div
        className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold transition-all duration-500 bg-slate-950/80 backdrop-blur-md border border-gold-500/20 text-gold-300 shadow-xl ${
          isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold-500"></span>
          </span>
          Playing Audio
        </span>
      </div>

      {/* Rotating Vinyl Player Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Vinyl Player Platter / Turntable Base */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-950/90 border border-white/10 hover:border-gold-500/30 transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer group"
        >
          {/* Glass Overlay Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

          {/* Vinyl Record */}
          <div 
            className={`w-12 h-12 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center relative shadow-inner transition-transform ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
            style={{
              backgroundImage: 'repeating-radial-gradient(circle, #262626, #262626 1px, #171717 2px, #171717 3px)',
              animationDuration: '6s'
            }}
          >
            {/* Vinyl Gleam Shine */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45 pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -rotate-45 pointer-events-none" />

            {/* Center Label (Colored with brand/primary theme) */}
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center relative shadow-md"
              style={{ backgroundColor: 'var(--primary-color, #085090)' }}
            >
              {/* Spindle Hole */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          </div>

          {/* Icon Overlay (visible on hover or when paused) */}
          <div className={`absolute inset-0 flex items-center justify-center z-20 bg-slate-950/40 transition-opacity duration-300 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}>
            {isPlaying ? (
              <Volume2 className="text-gold-200 animate-pulse-subtle" size={18} />
            ) : (
              <VolumeX className="text-slate-400" size={18} />
            )}
          </div>
        </button>

        {/* Tonearm (Playback Needle) */}
        <div 
          className="absolute -top-1 right-2 w-4 h-7 origin-top-right transition-transform duration-700 pointer-events-none z-30"
          style={{
            transform: isPlaying ? 'rotate(15deg)' : 'rotate(-10deg)',
          }}
        >
          {/* Tonearm arm */}
          <svg className="w-full h-full text-gold-400 drop-shadow-md" viewBox="0 0 20 40" fill="currentColor">
            {/* Pivot support */}
            <circle cx="15" cy="5" r="3" fill="#94a3b8" />
            {/* Arm shaft */}
            <path d="M15 5 L5 25 L8 30" stroke="#d4af37" strokeWidth="1.5" fill="none" />
            {/* Cartridge/headshell */}
            <rect x="5" y="27" width="5" height="7" rx="1" fill="#475569" />
          </svg>
        </div>
      </div>
    </div>
  );
}
