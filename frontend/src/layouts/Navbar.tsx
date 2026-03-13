// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-slate-200/50 py-3'
        : 'bg-transparent py-5 lg:py-8'
        }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">

        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform duration-300">
            <img src="logo1.png" alt="logo" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              MBNP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tech</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 leading-none">
              Web Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ${isActive
                    ? 'text-blue-700 bg-blue-50/80 shadow-inner'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Call to Action & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAuthAction}
            className="hidden md:flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            {isLoggedIn ? 'Dashboard' : 'Login'}
            <span className="text-white/70 text-xs">→</span>
          </button>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
          }`}
      >
        <div className="container mx-auto px-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-100 px-4">
            <button
              onClick={handleAuthAction}
              className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              {isLoggedIn ? 'Buka Dashboard' : 'Login ke Sistem'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;