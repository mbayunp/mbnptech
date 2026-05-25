// src/layouts/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Finance Quick', path: '/quick-add' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleAuthAction = () => {
    setIsMobileMenuOpen(false);
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed top-4 left-0 w-full z-50 px-4 md:px-8 transition-all duration-300">
      <nav
        className={`mx-auto max-w-7xl transition-all duration-500 border ${
          isMobileMenuOpen
            ? 'rounded-[2rem] bg-white/95 dark:bg-[#0B0F19]/95 border-slate-200/50 dark:border-white/10 shadow-2xl py-4 px-6'
            : isScrolled
              ? 'rounded-full bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-md border-white/20 dark:border-white/[0.05] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.15)] py-3 px-6'
              : 'rounded-full bg-white/40 dark:bg-[#030712]/40 backdrop-blur-sm border-white/10 dark:border-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.02)] py-4 px-6 md:py-5'
        }`}
      >
        <div className="flex justify-between items-center w-full">
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo1.png" alt="logo" className="w-full h-full object-contain filter dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                MBNP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Tech</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 leading-none">
                Web Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.name} className="relative">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 block ${
                      isActive
                        ? 'text-blue-600 dark:text-white bg-blue-50/80 dark:bg-blue-600/10 shadow-inner'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Call to Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all border border-slate-200/50 dark:border-white/[0.05]"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            <button
              onClick={handleAuthAction}
              className="hidden md:flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
            >
              {isLoggedIn ? 'Dashboard' : 'Login'}
              <ArrowRight size={14} />
            </button>

            {/* Hamburger Menu (Mobile) */}
            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-900 dark:text-white rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen
                ? <X size={20} strokeWidth={2.5} />
                : <Menu size={20} strokeWidth={2.5} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden w-full transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[500px] pt-4 pb-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-white/[0.05] pt-3 mt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.05]">
              <button
                onClick={handleAuthAction}
                className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoggedIn ? 'Buka Dashboard' : 'Login ke Sistem'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;