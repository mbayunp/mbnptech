import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Tambahkan padding-top agar konten tidak tertutup fixed navbar */}
      <main className="flex-grow pt-20"> 
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;