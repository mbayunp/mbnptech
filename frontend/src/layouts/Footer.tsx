import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 border-t border-slate-900 relative overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute top-[-100px] left-1/4 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Gigantic Call to Action (CTA) Section */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10 border-b border-slate-900 pb-20 mb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-4xl">
            <span className="text-xs font-black text-blue-500 tracking-[0.2em] uppercase mb-4 block">SIAP KOLABORASI?</span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Mari Bangun Sesuatu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                yang Luar Biasa.
              </span>
            </h2>
          </div>
          <div className="shrink-0 w-full lg:w-auto">
            <a
              href="https://wa.me/6289663933263"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full lg:w-auto items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-950/50 hover:scale-[1.02]"
            >
              Hubungi Kami Sekarang
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="container mx-auto px-6 max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
        {/* Column 1 - Brand */}
        <div className="lg:pr-8">
          <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
            <div className="relative flex items-center justify-center w-9 h-9 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo1.png" alt="logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              MBNP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Tech</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mb-8 font-medium">
            Merancang masa depan digital Anda melalui eksekusi teknologi mutakhir, arsitektur kokoh, dan pendekatan desain berorientasi pengguna.
          </p>
          <div className="flex gap-3">
            {/* Social Links as small elegant boxes */}
            <a
              href="https://www.linkedin.com/in/mbayunp/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all text-slate-400"
            >
              <span className="font-bold text-xs">in</span>
            </a>
            <a
              href="https://www.instagram.com/m.bayunp/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all text-slate-400"
            >
              <span className="font-bold text-xs">ig</span>
            </a>
            <a
              href="https://www.facebook.com/bayu.bojongiv"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all text-slate-400"
            >
              <span className="font-bold text-xs">fb</span>
            </a>
          </div>
        </div>

        {/* Column 2 - Navigation */}
        <div className="lg:pl-8">
          <h3 className="text-white font-black mb-6 tracking-wider uppercase text-[10px]">Navigasi Utama</h3>
          <ul className="space-y-4">
            {['Home', 'Services', 'Projects', 'Quick add', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2 group w-max"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-blue-500 group-hover:scale-150 transition-all"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h3 className="text-white font-black mb-6 tracking-wider uppercase text-[10px]">Hubungi Kami</h3>
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

        {/* Column 4 - Operational Hours / Info */}
        <div>
          <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-slate-900 backdrop-blur-md">
            <h3 className="text-white font-black mb-3 text-xs uppercase tracking-wider">Jam Kerja</h3>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-4">Tim kami siap melayani konsultasi dan pengerjaan proyek pada jam kerja efektif.</p>
            <div className="text-[11px] text-slate-300 font-mono space-y-1.5">
              <p className="flex justify-between"><span>Senin - Jumat</span> <span>09:00 - 17:00</span></p>
              <p className="flex justify-between"><span>Sabtu</span> <span>09:00 - 13:00</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto px-6 max-w-7xl pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} <span className="text-slate-300">MBNP Tech</span>. Hak Cipta Dilindungi.
        </p>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse"></span>
          SISTEM VERSI 2.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;