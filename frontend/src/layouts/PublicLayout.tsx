// src/layouts/PublicLayout.tsx
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion, type Variants, useScroll, useSpring } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScrollProvider from '../components/SmoothScrollProvider';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.98 },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -30,
    filter: 'blur(8px)',
    scale: 0.99,
    transition: { duration: 0.3, ease: 'easeInOut' as const }
  }
};

const PublicLayout = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#030712] transition-colors duration-300">
        {/* Top neon gradient progress bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-400 origin-left z-[100] shadow-[0_1px_12px_rgba(6,182,212,0.6)]" 
          style={{ scaleX }} 
        />

        <Navbar />

        {/* Tambahkan padding-top agar konten tidak tertutup fixed navbar */}
        <main className="flex-grow pt-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default PublicLayout;