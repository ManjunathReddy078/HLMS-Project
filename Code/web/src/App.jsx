import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';

// Admin Sub-pages
import Facilities from './pages/admin/Facilities';
import Inventory from './pages/admin/Inventory';
import Utilization from './pages/admin/Utilization';
import Alerts from './pages/admin/Alerts';

// Supervisor Sub-pages
import Tracking from './pages/supervisor/Tracking';
import Discrepancies from './pages/supervisor/Discrepancies';

// Shared Sub-pages
import Reports from './pages/Reports';

function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'supervisor', or null

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!userRole ? <Login onLogin={setUserRole} /> : 
                  userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/supervisor" />} 
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/facilities" element={userRole === 'admin' ? <Facilities onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/inventory" element={userRole === 'admin' ? <Inventory onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/utilization" element={userRole === 'admin' ? <Utilization onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/alerts" element={userRole === 'admin' ? <Alerts onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin/reports" element={userRole === 'admin' ? <Reports role="admin" onLogout={handleLogout} /> : <Navigate to="/" />} />

        {/* Supervisor Routes */}
        <Route path="/supervisor" element={userRole === 'supervisor' ? <SupervisorDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/supervisor/tracking" element={userRole === 'supervisor' ? <Tracking onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/supervisor/discrepancies" element={userRole === 'supervisor' ? <Discrepancies onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/supervisor/reports" element={userRole === 'supervisor' ? <Reports role="supervisor" onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
