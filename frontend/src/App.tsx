import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// (Placeholder) Import Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Projects from './pages/public/Projects';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
// import FinanceQuickAdd from './pages/public/FinanceQuickAdd';

// (Placeholder) Import Dashboard Pages
// import Dashboard from './pages/dashboard/Dashboard';
// import FinanceList from './pages/dashboard/finance/FinanceList';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC ROUTES (Portofolio & Quick Add) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          {/* <Route path="quick-add" element={<FinanceQuickAdd />} /> */}
        </Route>

        {/* 🔐 PRIVATE ROUTES (Dashboard & Analytics) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* <Route index element={<Dashboard />} /> */}
          {/* <Route path="finance" element={<FinanceList />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;