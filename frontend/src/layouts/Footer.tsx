import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

        {/* Column 1 - Brand */}
        <div className="lg:pr-8">
          <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="relative flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform duration-300">
              <img src="logo1.png" alt="logo" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              MBNP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tech</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mb-8 font-medium">
            Merancang masa depan digital Anda melalui eksekusi teknologi mutakhir, arsitektur kokoh, dan pendekatan desain berorientasi pengguna.
          </p>
          <div className="flex gap-4">
            {/* Social Links as small boxes */}
            <a href="https://www.linkedin.com/in/mbayunp/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-slate-400">
              <span className="font-bold text-xs">in</span>
            </a>
            <a href="https://www.instagram.com/m.bayunp/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all text-slate-400">
              <span className="font-bold text-xs">ig</span>
            </a>
            <a href="https://www.facebook.com/bayu.bojongiv" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all text-slate-400">
              <span className="font-bold text-xs">fb</span>
            </a>
          </div>
        </div>

        {/* Column 2 - Navigation */}
        <div className="lg:pl-8">
          <h3 className="text-white font-black mb-6 tracking-wider uppercase text-xs">Navigasi Utama</h3>
          <ul className="space-y-4">
            {['Home', 'Services', 'Projects', 'Quick add', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2 group w-max"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 group-hover:scale-150 transition-all"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h3 className="text-white font-black mb-6 tracking-wider uppercase text-xs">Hubungi Kami</h3>
          <div className="space-y-5 text-sm font-medium">
            <div>
              <p className="text-slate-500 text-xs mb-1">Founder</p>
              <p className="text-slate-300">Muhammad Bayu Nurdiansyah P.</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Lokasi Base</p>
              <p className="text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Bandung | Cianjur | Garut
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Email Pertanyaan</p>
              <a href="mailto:muhammadbayunp@gmail.com" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors block truncate">
                muhammadbayunp@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Column 4 - CTA */}
        <div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50">
            <h3 className="text-white font-black mb-3 text-lg">Mulai Proyek?</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">Konsultasikan kebutuhan digital Anda. Kami siap merancang solusi yang tepat guna.</p>
            <a href="https://wa.me/6289663933263" target="_blank" rel="noopener noreferrer" className="block w-full py-3 px-4 bg-white text-slate-900 text-center text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Chat via WhatsApp
            </a>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-6 max-w-7xl pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} <span className="text-slate-300">MBNP Tech</span>. Hak Cipta Dilindungi.
        </p>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          SISTEM VERSI 1.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;