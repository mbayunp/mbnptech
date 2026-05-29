'use client';

import { useState, useEffect, useCallback } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  themeColor?: string; // used for numbers
  textColor?: string;  // used for labels
  glassMode?: 'light' | 'dark' | 'premium';
  className?: string;
}

export default function CountdownTimer({ 
  targetDate, 
  themeColor = 'var(--primary-color, #d4af37)', 
  textColor = 'text-slate-400',
  glassMode = 'premium',
  className = '' 
}: CountdownTimerProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!isMounted) return null;

  // Set glassmorphism styling based on theme
  let cardClass = "bg-white/80 backdrop-blur-md border border-slate-100/50 shadow-sm";
  if (glassMode === 'dark') {
    cardClass = "bg-slate-950/80 backdrop-blur-lg border border-white/10 shadow-xl";
  } else if (glassMode === 'premium') {
    cardClass = "bg-slate-900/60 backdrop-blur-xl border border-gold-500/10 shadow-2xl relative overflow-hidden group hover:border-gold-500/20 transition-all duration-300";
  }

  return (
    <div className={`flex justify-center gap-3 sm:gap-4 ${className}`}>
      {[
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
      ].map((item, index) => (
        <div
          key={index}
          className={`flex flex-col items-center px-4 py-3 sm:py-4 rounded-xl min-w-[70px] sm:min-w-[85px] ${cardClass}`}
        >
          {glassMode === 'premium' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}
          <span
            className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif drop-shadow-sm"
            style={{ color: themeColor }}
          >
            {String(item.value).padStart(2, '0')}
          </span>
          <span className={`text-[9px] sm:text-xs font-semibold uppercase tracking-widest mt-1 ${textColor}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
