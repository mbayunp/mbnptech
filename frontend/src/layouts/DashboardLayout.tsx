import { Outlet } from 'react-router-dom';
// import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Area Sidebar Kiri */}
      {/* <Sidebar /> */}
      
      {/* Area Konten Utama Kanan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Dashboard Minimalis */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">MBNP <span className="text-blue-600">Workspace</span></h1>
        </header>
        
        {/* Area Halaman Dashboard (Bisa di-scroll) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;