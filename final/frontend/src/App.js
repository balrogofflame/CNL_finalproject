import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.tsx'; // 登入組件
import Register from './components/register.tsx'; // 引入注册组件
import Home from './components/home.tsx'; // 引入注册组件
import { AuthProvider } from './AuthContext'; // 引入AuthProvider


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* 添加注册路由 */}
          <Route path="/home" element={<Home />} /> {/* 添加注册路由 */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
