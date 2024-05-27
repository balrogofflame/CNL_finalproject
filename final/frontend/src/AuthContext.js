import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const loginWithGitHub = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
