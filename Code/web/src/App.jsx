import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';

function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'supervisor', or null

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!userRole ? <Login onLogin={setUserRole} /> : 
                  userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/supervisor" />} 
        />
        
        <Route 
          path="/admin" 
          element={userRole === 'admin' ? <AdminDashboard onLogout={() => setUserRole(null)} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/supervisor" 
          element={userRole === 'supervisor' ? <SupervisorDashboard onLogout={() => setUserRole(null)} /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
