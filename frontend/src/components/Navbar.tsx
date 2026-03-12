import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">MBNP Tech</Link>
        <div className="space-x-8 hidden md:flex">
          <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
          <Link to="/services" className="hover:text-blue-600 font-medium">Services</Link>
          <Link to="/projects" className="hover:text-blue-600 font-medium">Projects</Link>
          <Link to="/contact" className="hover:text-blue-600 font-medium">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;