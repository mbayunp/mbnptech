// src/utils/animations.ts
import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 }
  }
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};
