import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
// import DashboardLayout from './layouts/DashboardLayout'; // Hapus atau komen ini karena kita pakai AdminLayout

// import auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Import Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Projects from './pages/public/Projects';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
import FinanceQuickAdd from './pages/public/FinanceQuickAdd';

// Import Admin/Dashboard Pages
import Dashboard from './pages/admin/Dashboard';
import Activity from './pages/admin/Activity';
import Finance from './pages/admin/Finance';
import Todo from './pages/admin/Todo';
import LifePlan from './pages/admin/LifePlan';
import Habits from './pages/admin/Habits';
import Achievements from './pages/admin/Achievements';
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
          <Route path="quick-add" element={<FinanceQuickAdd />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* 🔐 PRIVATE / ADMIN ROUTES (Dashboard & Analytics) */}
        {/* Kita buat /admin sebagai rute induk tunggal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activity" element={<Activity />} />

          <Route path="finance" element={<Finance />} />
          <Route path="todo" element={<Todo />} />
          <Route path="planing" element={<LifePlan />} />
          <Route path="habits" element={<Habits />} />
          <Route path="achievements" element={<Achievements />} />

          {/* Nanti route lain ditambahkan di sini, contoh: */}
          {/* <Route path="finance" element={<FinanceList />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;