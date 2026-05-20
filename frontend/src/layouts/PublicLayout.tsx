// src/layouts/PublicLayout.tsx
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: 'easeInOut' as const }
  }
};

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
  );
};

export default PublicLayout;