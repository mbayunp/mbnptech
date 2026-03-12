import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import About from '../pages/About';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import Services from '../pages/Services';
import Contact from '../pages/public/Contact';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;