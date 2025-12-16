import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Plans from '../pages/Plans';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../pages/Dashboard';
import Recharge from '../pages/Recharge';
import History from '../pages/History';
import Admin from '../pages/Admin';

function AppRoutes({ user, onLogin }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/recharge" element={<Recharge user={user} />} />
      <Route path="/login" element={!user ? <Login onLogin={onLogin} /> : (user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/home" />)} />
      <Route path="/register" element={!user ? <Register onLogin={onLogin} /> : (user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/home" />)} />
      <Route path="/user/home" element={user && user.role === 'USER' ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={<Navigate to="/user/home" />} />
      <Route path="/history" element={user && user.role === 'USER' ? <History /> : <Navigate to="/login" />} />
      <Route path="/admin/dashboard" element={user && user.role === 'ADMIN' ? <Admin /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;