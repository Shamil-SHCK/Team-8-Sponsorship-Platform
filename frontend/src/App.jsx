import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import './App.css';

// Protected Route Component with Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate dashboard based on the user's role
    switch (userRole) {
      case 'administrator':
        return <Navigate to="/dashboard" replace />;
      case 'company':
        return <Navigate to="/company-dashboard" replace />;
      case 'club-admin':
        return <Navigate to="/club-dashboard" replace />;
      case 'alumni-individual':
        return <Navigate to="/alumni-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-dashboard"
          element={
            <ProtectedRoute allowedRoles={['club-admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni-dashboard"
          element={
            <ProtectedRoute allowedRoles={['alumni-individual']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['administrator']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
