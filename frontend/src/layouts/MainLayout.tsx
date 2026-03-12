import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* Navbar Modern */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-6 transition-transform">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">MBNP <span className="text-blue-600">Tech</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/projects" className="hover:text-blue-600 transition-colors">Projects</Link>
            <Link to="/contact" className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95">
              Contact Us
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Minimalis */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 font-medium">© 2026 MBNP Tech - Solusi Website Profesional</p>
          <p className="text-slate-400 text-sm mt-2">Built with React + Tailwind + TypeScript</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;