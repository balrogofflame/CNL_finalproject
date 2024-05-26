import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the authentication token in the URL query parameters or local storage
    const token = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('authToken');
    console.log(token)
    if (token) {
      localStorage.setItem('authToken', token); // Store token in local storage if it's in the URL
      setIsAuthenticated(true);
    }
  }, []);

  const loginWithGitHub = () => {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GITHUB_REDIRECT_URI;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loginWithGitHub }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
