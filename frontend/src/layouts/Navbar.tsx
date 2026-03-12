// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Efek untuk Sticky Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mengecek status login setiap kali komponen di-render
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
      navigate('/admin/dashboard'); // Jika sudah login, pergi ke dashboard
    } else {
      navigate('/login'); // Jika belum, pergi ke halaman login
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Brand / Logo Terintegrasi */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo1.png" alt="MBNP Tech Logo" className="h-10 w-auto object-contain" />
          
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              MBNP <span className="text-[#2563EB]">Tech</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1 leading-none">
              Web Dev Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink 
                to={link.path}
                className={({ isActive }) => 
                  `text-sm font-semibold transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-600 hover:text-[#38BDF8]'
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
            className="hidden md:inline-block bg-[#2563EB] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
          >
            {isLoggedIn ? 'Dashboard' : 'Login'}
          </button>
          
          {/* Hamburger Menu (Mobile) */}
          <button 
            className="lg:hidden text-slate-900 text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block text-base font-semibold ${isActive ? 'text-[#2563EB]' : 'text-slate-700'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button 
            onClick={handleAuthAction}
            className="text-center bg-[#2563EB] text-white px-4 py-3 rounded-xl font-bold mt-2"
          >
            {isLoggedIn ? 'Buka Dashboard' : 'Login ke Sistem'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;