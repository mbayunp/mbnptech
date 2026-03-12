import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 border-t-4 border-[#2563EB]">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1 - Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <img src="/logo.png" alt="MBNP Tech Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <h2 className="text-2xl font-black text-white">
              MBNP <span className="text-[#38BDF8]">Tech</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            MBNP Tech menyediakan layanan pengembangan website modern, sistem informasi, dan solusi digital untuk mendukung transformasi bisnis dan organisasi.
          </p>
        </div>

        {/* Column 2 - Navigation */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Navigation</h3>
          <ul className="space-y-3">
            {['Home', 'Services', 'Projects', 'Finance Quick', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-sm hover:text-[#38BDF8] transition-colors flex items-center gap-2"
                >
                  <span className="text-[#2563EB] text-xs">▹</span> {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contact Info</h3>
          <div className="space-y-4 text-sm">
            <p className="font-semibold text-white">Muhammad Bayu Nurdiansyah Putra</p>
            <p className="flex items-start gap-2">
              <span className="text-[#38BDF8]">📍</span> Bandung | Cianjur | Garut
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#38BDF8]">✉️</span> 
              <a href="mailto:muhammadbayunp@gmail.com" className="hover:text-white transition-colors">
                muhammadbayunp@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[#38BDF8]">📱</span> 
              <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                089663933263
              </a>
            </p>
          </div>
        </div>

        {/* Column 4 - Social Media */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Social Media</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center">in</span> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/m.bayunp/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center">ig</span> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/bayu.bojongiv" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center">fb</span> Facebook
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright & Version Info */}
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center flex flex-col items-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MBNP Tech — Solusi Website Profesional
        </p>
        <p className="text-[10px] text-slate-600 mt-2 font-medium">
          Built with React + Tailwind <span className="mx-2 text-slate-700">|</span> <span className="text-[#38BDF8]">Versi Website 1.0</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;