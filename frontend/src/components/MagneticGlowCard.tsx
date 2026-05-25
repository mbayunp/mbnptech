import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, type HTMLMotionProps } from 'framer-motion';

interface MagneticGlowCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(99, 102, 241, 0.15)"
  hoverScale?: number;
}

export const MagneticGlowCard: React.FC<MagneticGlowCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.12)', // Subtle blue glow
  hoverScale = 1.01,
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(
      450px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: hoverScale, y: -2 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200/60 dark:border-white/[0.05] bg-white dark:bg-[#0B0F19] p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:hover:shadow-blue-500/[0.02] group ${className}`}
      {...props}
    >
      {/* Pointer Hover Glow Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 z-0"
        style={{
          background,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default MagneticGlowCard;
