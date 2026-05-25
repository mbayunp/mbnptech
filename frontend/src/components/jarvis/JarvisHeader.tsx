import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Maximize2, Minimize2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface JarvisHeaderProps {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  isMinimized: boolean;
  isExpanded: boolean;
  onToggleMinimize: () => void;
  onToggleExpand: () => void;
  onClose: () => void;
  pathname: string;
}

export const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  status,
  isMinimized,
  isExpanded,
  onToggleMinimize,
  onToggleExpand,
  onClose,
  pathname
}) => {
  // Get readable context name based on current route path
  const getContextName = () => {
    if (pathname.includes('/finance')) return 'FINANCE CONTEXT';
    if (pathname.includes('/spiritual')) return 'SPIRITUAL CONTEXT';
    if (pathname.includes('/habits')) return 'HABITS CONTEXT';
    if (pathname.includes('/wedding')) return 'WEDDING CONTEXT';
    return 'SYSTEM WIDE';
  };

  const contextName = getContextName();

  // Status colors & descriptions
  const getStatusConfig = () => {
    switch (status) {
      case 'listening': return { text: 'LISTENING MODE', color: 'text-rose-450 dark:text-rose-400', dot: 'bg-rose-500 animate-ping' };
      case 'thinking': return { text: 'INDEXING BRAIN', color: 'text-indigo-400', dot: 'bg-indigo-500 animate-pulse' };
      case 'speaking': return { text: 'SPEAKING', color: 'text-cyan-400', dot: 'bg-cyan-400 animate-pulse' };
      case 'idle':
      default: return { text: 'SYSTEM STANDBY', color: 'text-emerald-450 dark:text-emerald-400', dot: 'bg-emerald-500' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <header className="relative z-15 flex justify-between items-center px-6 py-4 border-b border-cyan-500/10 bg-slate-950/60 backdrop-blur-md select-none">
      {/* Top Cyan Glowing Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent" />

      {/* Left: Avatar & AI Info */}
      <div className="flex items-center gap-3">
        {/* Arc Reactor Mini Avatar */}
        <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/20 flex items-center justify-center shadow-lg overflow-hidden shrink-0 group">
          {/* Inner ambient glow */}
          <div className={`absolute inset-0.5 rounded-lg opacity-10 blur-[3px] transition-colors duration-500 ${
            status === 'listening' ? 'bg-rose-500' :
            status === 'thinking' ? 'bg-indigo-500 animate-pulse' :
            status === 'speaking' ? 'bg-cyan-500' : 'bg-emerald-500'
          }`} />

          {/* Mini Rotating ring */}
          <motion.div
            animate={{ rotate: status === 'thinking' ? -360 : 360 }}
            transition={{
              repeat: Infinity,
              duration: status === 'thinking' ? 1.5 : status === 'speaking' ? 4 : status === 'listening' ? 6 : 15,
              ease: "linear"
            }}
            className={`absolute inset-1 rounded-lg border border-dashed ${
              status === 'listening' ? 'border-rose-500/40' :
              status === 'thinking' ? 'border-indigo-400/60' :
              status === 'speaking' ? 'border-cyan-400/50' : 'border-cyan-500/20'
            }`}
          />

          <Bot className={`w-4 h-4 z-10 transition-colors duration-300 ${
            status === 'listening' ? 'text-rose-400' :
            status === 'thinking' ? 'text-indigo-400' :
            status === 'speaking' ? 'text-cyan-300' : 'text-cyan-400/70'
          }`} />

          {/* Ping dot */}
          <span className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 z-20 ${statusConfig.dot}`} />
        </div>

        {/* Brand & Status */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black tracking-widest text-cyan-200">JARVIS // v2.6</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 uppercase tracking-widest shrink-0">
              {contextName}
            </span>
          </div>
          <p className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${statusConfig.color}`}>
            {statusConfig.text}
          </p>
        </div>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Minimize Button */}
        <button
          onClick={onToggleMinimize}
          className="w-7 h-7 rounded-lg bg-slate-900 border border-white/[0.04] text-slate-400 hover:text-cyan-400 hover:bg-slate-800 flex items-center justify-center transition-all"
          title={isMinimized ? "Restore" : "Minimize"}
        >
          {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Fullscreen Button */}
        {!isMinimized && (
          <button
            onClick={onToggleExpand}
            className="w-7 h-7 rounded-lg bg-slate-900 border border-white/[0.04] text-slate-400 hover:text-cyan-400 hover:bg-slate-800 flex items-center justify-center transition-all hidden sm:flex"
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-slate-900 border border-white/[0.04] text-slate-450 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition-all"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>
    </header>
  );
};

export default JarvisHeader;
