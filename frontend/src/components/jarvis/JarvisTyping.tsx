import React from 'react';
import { motion, Variants } from 'framer-motion';

export const JarvisTyping: React.FC = () => {
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const dotVariants: Variants = {
    initial: { y: 0, opacity: 0.3 },
    animate: {
      y: -6,
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex items-center gap-3 bg-slate-900/60 dark:bg-slate-950/45 border border-cyan-500/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_4px_15px_rgba(6,182,212,0.05)] w-max">
      {/* Visual Indicator Line */}
      <span className="w-1 h-3 rounded-full bg-cyan-400 animate-pulse shrink-0" />

      {/* Animated dots container */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex items-center gap-1.5 h-3"
      >
        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        <motion.span variants={dotVariants} className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      </motion.div>

      <span className="text-[10px] font-mono text-cyan-400/60 tracking-wider animate-pulse ml-1">JARVIS THINKING</span>
    </div>
  );
};

export default JarvisTyping;
