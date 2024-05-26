import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/home.tsx';
import Login from './components/login.tsx';
import Register from './components/register.tsx'; // 假设有一个 Register 组件
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, AuthContext } from './AuthContext.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
    </Routes>
  );
};

export default App;
